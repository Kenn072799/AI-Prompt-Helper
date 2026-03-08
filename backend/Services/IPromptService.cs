using PromptHelperAPI.DTOs;
using PromptHelperAPI.Models;

namespace PromptHelperAPI.Services;

public interface IPromptService
{
    Task<AnalyzeResponse> AnalyzeAndImproveAsync(string originalPrompt);
    Task<List<PromptListItem>> GetHistoryAsync();
    Task<AnalyzeResponse?> GetByIdAsync(int id);
    Task<TrendsResponse> GetTrendsAsync(bool force = false);
}
