namespace PromptHelperAPI.Models;

public class Prompt
{
    public int Id { get; set; }
    public string OriginalPrompt { get; set; } = string.Empty;
    public string ImprovedPrompt { get; set; } = string.Empty;
    public int Score { get; set; }
    public string Strengths { get; set; } = string.Empty;
    public string Weaknesses { get; set; } = string.Empty;
    public string Suggestions { get; set; } = string.Empty;
    public string Category { get; set; } = "General";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
