namespace PromptHelperAPI.DTOs;

public class AnalyzeRequest
{
    public string OriginalPrompt { get; set; } = string.Empty;
}

public class ScoreBreakdown
{
    public int Role { get; set; }
    public int Context { get; set; }
    public int Constraints { get; set; }
    public int ExpectedOutput { get; set; }
}

public class AnalyzeResponse
{
    public int Id { get; set; }
    public string OriginalPrompt { get; set; } = string.Empty;
    public string ImprovedPrompt { get; set; } = string.Empty;
    public int Score { get; set; }
    public ScoreBreakdown? ScoreBreakdown { get; set; }
    public List<string> Strengths { get; set; } = [];
    public List<string> Weaknesses { get; set; } = [];
    public List<string> Suggestions { get; set; } = [];
    public string Category { get; set; } = "General";
    public DateTime CreatedAt { get; set; }
}

public class PromptListItem
{
    public int Id { get; set; }
    public string OriginalPrompt { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public int Score { get; set; }
    public DateTime CreatedAt { get; set; }
}

public class CategoryStat
{
    public string Category { get; set; } = string.Empty;
    public int Count { get; set; }
    public int Percentage { get; set; }
    public double AvgScore { get; set; }
}

public class TrendTopic
{
    public string Topic { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
}

public class TrendsResponse
{
    public int TotalPrompts { get; set; }
    public List<CategoryStat> CategoryStats { get; set; } = [];
    public List<TrendTopic> TrendingTopics { get; set; } = [];
    public string Insight { get; set; } = string.Empty;
    public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
}

