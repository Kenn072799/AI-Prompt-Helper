using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using PromptHelperAPI.DTOs;
using PromptHelperAPI.Services;

namespace PromptHelperAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PromptsController(IPromptService promptService, ILogger<PromptsController> logger) : ControllerBase
{
    private const int MaxPromptLength = 5000;

    [HttpPost("analyze")]
    [EnableRateLimiting("analyze-limit")]
    public async Task<ActionResult<AnalyzeResponse>> Analyze([FromBody] AnalyzeRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.OriginalPrompt))
            return BadRequest(new { error = "Prompt cannot be empty." });

        if (request.OriginalPrompt.Length > MaxPromptLength)
            return BadRequest(new { error = $"Prompt too long. Maximum {MaxPromptLength} characters allowed." });

        try
        {
            var result = await promptService.AnalyzeAndImproveAsync(request.OriginalPrompt);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error analyzing prompt");
            return StatusCode(500, new { error = "An internal error occurred. Please try again." });
        }
    }

    [HttpGet("history")]
    public async Task<ActionResult<List<PromptListItem>>> GetHistory()
    {
        var history = await promptService.GetHistoryAsync();
        return Ok(history);
    }

    [HttpGet("trends")]
    public async Task<ActionResult<TrendsResponse>> GetTrends([FromQuery] bool force = false)
    {
        try
        {
            var result = await promptService.GetTrendsAsync(force);
            return Ok(result);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching trends");
            return StatusCode(500, new { error = "An internal error occurred. Please try again." });
        }
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<AnalyzeResponse>> GetById(int id)
    {
        var result = await promptService.GetByIdAsync(id);
        if (result is null) return NotFound();
        return Ok(result);
    }
}
