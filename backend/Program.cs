using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using PromptHelperAPI.Data;
using PromptHelperAPI.Services;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();

// PostgreSQL via Neon
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Groq HTTP client
builder.Services.AddHttpClient<IPromptService, PromptService>();

// CORS — origins configurable via AllowedOrigins in appsettings (or env vars for production)
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>()
    ?? ["http://localhost:5173"];
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactApp", policy =>
        policy.WithOrigins(allowedOrigins)
              .AllowAnyHeader()
              .AllowAnyMethod());
});

// Rate limiting — protect Groq API quota from abuse
builder.Services.AddRateLimiter(options =>
{
    // Analyze endpoint: max 10 requests per minute per IP
    options.AddFixedWindowLimiter("analyze-limit", opt =>
    {
        opt.PermitLimit = 10;
        opt.Window = TimeSpan.FromMinutes(1);
        opt.QueueProcessingOrder = QueueProcessingOrder.OldestFirst;
        opt.QueueLimit = 2;
    });
    options.RejectionStatusCode = 429;
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

// Render terminates TLS at its proxy — only redirect in local dev
if (app.Environment.IsDevelopment())
    app.UseHttpsRedirection();

app.UseCors("ReactApp");
app.UseRateLimiter();
app.UseAuthorization();
app.MapControllers();

app.MapGet("/health", () => Results.Ok(new { status = "healthy", timestamp = DateTime.UtcNow }));

// Auto-migrate on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Render provides a PORT env var — listen on it; fall back to 8080 for local Docker
var port = Environment.GetEnvironmentVariable("PORT") ?? "8080";
app.Run($"http://0.0.0.0:{port}");

