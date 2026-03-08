using Microsoft.EntityFrameworkCore;
using PromptHelperAPI.Models;

namespace PromptHelperAPI.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Prompt> Prompts => Set<Prompt>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Prompt>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.OriginalPrompt).IsRequired();
            entity.Property(e => e.ImprovedPrompt).IsRequired();
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("NOW()");
        });
    }
}
