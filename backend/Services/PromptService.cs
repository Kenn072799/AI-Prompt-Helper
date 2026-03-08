using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using PromptHelperAPI.Data;
using PromptHelperAPI.DTOs;
using PromptHelperAPI.Models;

namespace PromptHelperAPI.Services;

public class PromptService(HttpClient httpClient, IConfiguration config, AppDbContext db) : IPromptService
{
    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    // In-memory trends cache
    private static TrendsResponse? _cachedTrends;
    private static DateTime _cacheExpiry = DateTime.MinValue;
    private static readonly TimeSpan CacheTtl = TimeSpan.FromHours(1);
    private static readonly SemaphoreSlim _cacheLock = new(1, 1);

    public async Task<AnalyzeResponse> AnalyzeAndImproveAsync(string originalPrompt)
    {
        var groqResult = await CallGroqAsync(originalPrompt);

        var prompt = new Prompt
        {
            OriginalPrompt = originalPrompt,
            ImprovedPrompt = groqResult.ImprovedPrompt,
            Score = groqResult.Score,
            Strengths = string.Join("|", groqResult.Strengths),
            Weaknesses = string.Join("|", groqResult.Weaknesses),
            Suggestions = string.Join("|", groqResult.Suggestions),
            Category = groqResult.Category,
            CreatedAt = DateTime.UtcNow
        };

        db.Prompts.Add(prompt);
        await db.SaveChangesAsync();

        groqResult.Id = prompt.Id;
        groqResult.CreatedAt = prompt.CreatedAt;
        return groqResult;
    }

    public async Task<List<PromptListItem>> GetHistoryAsync()
    {
        return await db.Prompts
            .OrderByDescending(p => p.CreatedAt)
            .Select(p => new PromptListItem
            {
                Id = p.Id,
                OriginalPrompt = p.OriginalPrompt,
                Category = p.Category,
                Score = p.Score,
                CreatedAt = p.CreatedAt
            })
            .ToListAsync();
    }

    public async Task<AnalyzeResponse?> GetByIdAsync(int id)
    {
        var p = await db.Prompts.FindAsync(id);
        if (p is null) return null;

        return new AnalyzeResponse
        {
            Id = p.Id,
            OriginalPrompt = p.OriginalPrompt,
            ImprovedPrompt = p.ImprovedPrompt,
            Score = p.Score,
            Strengths = [.. p.Strengths.Split('|', StringSplitOptions.RemoveEmptyEntries)],
            Weaknesses = [.. p.Weaknesses.Split('|', StringSplitOptions.RemoveEmptyEntries)],
            Suggestions = [.. p.Suggestions.Split('|', StringSplitOptions.RemoveEmptyEntries)],
            Category = p.Category,
            CreatedAt = p.CreatedAt
        };
    }

    public async Task<TrendsResponse> GetTrendsAsync(bool force = false)
    {
        if (!force && _cachedTrends is not null && DateTime.UtcNow < _cacheExpiry)
            return _cachedTrends;

        await _cacheLock.WaitAsync();
        try
        {
            // Double-check after acquiring lock
            if (!force && _cachedTrends is not null && DateTime.UtcNow < _cacheExpiry)
                return _cachedTrends;

            var result = await FetchTrendsFromGroqAsync();
            _cachedTrends = result;
            _cacheExpiry = DateTime.UtcNow.Add(CacheTtl);
            return result;
        }
        finally
        {
            _cacheLock.Release();
        }
    }

    private async Task<TrendsResponse> FetchTrendsFromGroqAsync()
    {
        var recentPrompts = await db.Prompts
            .OrderByDescending(p => p.CreatedAt)
            .Take(50)
            .ToListAsync();

        var total = recentPrompts.Count;

        if (total == 0)
            return new TrendsResponse { TotalPrompts = 0, Insight = "No prompts analyzed yet. Start using the Playground!" };

        // Build category stats from DB
        var categoryStats = recentPrompts
            .GroupBy(p => p.Category)
            .Select(g => new CategoryStat
            {
                Category = g.Key,
                Count = g.Count(),
                Percentage = (int)Math.Round((double)g.Count() / total * 100),
                AvgScore = Math.Round(g.Average(p => p.Score), 1)
            })
            .OrderByDescending(c => c.Count)
            .ToList();

        // Send prompt summaries to Groq for trend analysis
        var promptSummaries = string.Join("\n", recentPrompts
            .Take(20)
            .Select((p, i) => $"{i + 1}. [{p.Category}] {p.OriginalPrompt.Substring(0, Math.Min(120, p.OriginalPrompt.Length))}"));

        var trendInsight = await CallGroqForTrendsAsync(promptSummaries, categoryStats);

        return new TrendsResponse
        {
            TotalPrompts = total,
            CategoryStats = categoryStats,
            TrendingTopics = trendInsight.TrendingTopics,
            Insight = trendInsight.Insight,
            GeneratedAt = DateTime.UtcNow
        };
    }

    private async Task<TrendsResponse> CallGroqForTrendsAsync(string promptSummaries, List<CategoryStat> categoryStats)
    {
        var apiKey = config["Groq:ApiKey"] ?? throw new InvalidOperationException("Groq API key not configured.");
        var model = config["Groq:Model"] ?? "llama-3.3-70b-versatile";
        var url = config["Groq:BaseUrl"] ?? "https://api.groq.com/openai/v1/chat/completions";

        var categorySummary = string.Join(", ", categoryStats.Select(c => $"{c.Category}: {c.Count}"));

        var systemMessage = await File.ReadAllTextAsync(
            Path.Combine(AppContext.BaseDirectory, "Prompts", "trends_prompt.txt"));

        var userMessage = $"Category distribution: {categorySummary}\n\nRecent prompts:\n{promptSummaries}";

        var requestBody = new
        {
            model,
            messages = new[]
            {
                new { role = "system", content = systemMessage },
                new { role = "user", content = userMessage }
            },
            temperature = 0.7,
            max_tokens = 800
        };

        var json = JsonSerializer.Serialize(requestBody);
        var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var response = await httpClient.SendAsync(request);
        var responseJson = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"Groq API error {(int)response.StatusCode}: {responseJson}");

        using var doc = JsonDocument.Parse(responseJson);
        var content = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "{}";

        content = content.Trim();
        if (content.StartsWith("```"))
        {
            var start = content.IndexOf('{');
            var end = content.LastIndexOf('}');
            if (start >= 0 && end >= 0) content = content[start..(end + 1)];
        }

        using var resultDoc = JsonDocument.Parse(content);
        var root = resultDoc.RootElement;

        var topics = root.GetProperty("trendingTopics").EnumerateArray()
            .Select(t => new TrendTopic
            {
                Topic = t.GetProperty("topic").GetString() ?? "",
                Description = t.GetProperty("description").GetString() ?? "",
                Category = t.GetProperty("category").GetString() ?? ""
            }).ToList();

        return new TrendsResponse
        {
            TrendingTopics = topics,
            Insight = root.GetProperty("insight").GetString() ?? ""
        };
    }

    private async Task<AnalyzeResponse> CallGroqAsync(string userPrompt)
    {
        var apiKey = config["Groq:ApiKey"] ?? throw new InvalidOperationException("Groq API key not configured.");
        var model = config["Groq:Model"] ?? "llama-3.3-70b-versatile";
        var url = config["Groq:BaseUrl"] ?? "https://api.groq.com/openai/v1/chat/completions";

        var systemMessage = await File.ReadAllTextAsync(
            Path.Combine(AppContext.BaseDirectory, "Prompts", "analyze_prompt.txt"));

        var requestBody = new
        {
            model,
            messages = new[]
            {
                new { role = "system", content = systemMessage },
                new { role = "user", content = userPrompt }
            },
            temperature = 0.7,
            max_tokens = 1500
        };

        var json = JsonSerializer.Serialize(requestBody);
        var request = new HttpRequestMessage(HttpMethod.Post, url)
        {
            Content = new StringContent(json, Encoding.UTF8, "application/json")
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        var response = await httpClient.SendAsync(request);
        var responseJson = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            throw new InvalidOperationException($"Groq API error {(int)response.StatusCode}: {responseJson}");
        using var doc = JsonDocument.Parse(responseJson);

        var content = doc.RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString() ?? "{}";

        // Extract JSON from markdown code blocks if present
        content = content.Trim();
        if (content.StartsWith("```"))
        {
            var start = content.IndexOf('{');
            var end = content.LastIndexOf('}');
            if (start >= 0 && end >= 0)
                content = content[start..(end + 1)];
        }

        // Sanitize: replace literal newlines/tabs inside JSON string values
        // The model sometimes outputs unescaped newlines inside string values
        content = SanitizeJsonString(content);

        using var resultDoc = JsonDocument.Parse(content);
        var root = resultDoc.RootElement;

        return new AnalyzeResponse
        {
            OriginalPrompt = userPrompt,
            ImprovedPrompt = root.GetProperty("improvedPrompt").GetString() ?? string.Empty,
            Score = root.GetProperty("score").GetInt32(),
            ScoreBreakdown = root.TryGetProperty("scoreBreakdown", out var bd)
                ? new ScoreBreakdown
                {
                    Role = bd.TryGetProperty("role", out var r) ? r.GetInt32() : 0,
                    Context = bd.TryGetProperty("context", out var c) ? c.GetInt32() : 0,
                    Constraints = bd.TryGetProperty("constraints", out var cn) ? cn.GetInt32() : 0,
                    ExpectedOutput = bd.TryGetProperty("expectedOutput", out var eo) ? eo.GetInt32() : 0
                }
                : null,
            Strengths = [.. root.GetProperty("strengths").EnumerateArray().Select(s => s.GetString() ?? "")],
            Weaknesses = [.. root.GetProperty("weaknesses").EnumerateArray().Select(s => s.GetString() ?? "")],
            Suggestions = [.. root.GetProperty("suggestions").EnumerateArray().Select(s => s.GetString() ?? "")],
            Category = root.GetProperty("category").GetString() ?? "General"
        };
    }

    /// <summary>
    /// Fixes unescaped newlines/tabs/carriage-returns inside JSON string values
    /// that some LLM outputs produce, making them valid JSON.
    /// </summary>
    private static string SanitizeJsonString(string raw)
    {
        var sb = new System.Text.StringBuilder(raw.Length);
        bool inString = false;
        bool escaped = false;
        foreach (char ch in raw)
        {
            if (escaped)
            {
                sb.Append(ch);
                escaped = false;
                continue;
            }
            if (ch == '\\')
            {
                escaped = true;
                sb.Append(ch);
                continue;
            }
            if (ch == '"')
            {
                inString = !inString;
                sb.Append(ch);
                continue;
            }
            if (inString)
            {
                switch (ch)
                {
                    case '\n': sb.Append("\\n"); break;
                    case '\r': sb.Append("\\r"); break;
                    case '\t': sb.Append("\\t"); break;
                    default: sb.Append(ch); break;
                }
            }
            else
            {
                sb.Append(ch);
            }
        }
        return sb.ToString();
    }
}
