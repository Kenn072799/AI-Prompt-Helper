import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLayerGroup } from "react-icons/fa";

const templates = [
  {
    id: 1,
    title: "System Design",
    category: "System Design",
    description: "Design a scalable system architecture",
    template: `Role:
You are a senior software architect with expertise in designing scalable, production-grade systems.

Context:
I am building [describe your system — e.g. an e-commerce platform for small businesses]. The system needs to support [describe users/scale — e.g. hundreds of concurrent users]. The goal is to [describe the purpose clearly].

Tech Stack:
- Frontend: [e.g. React]
- Backend: [e.g. ASP.NET Core]
- Database: [e.g. PostgreSQL]
- Hosting: [e.g. Vercel + Render]

Features:
- [Core feature 1]
- [Core feature 2]
- [Core feature 3]

Constraints:
- Use free-tier services only
- No paid third-party APIs
- Must be deployable by a single developer

Expected Output:
- System architecture overview
- Database schema with table definitions
- REST API endpoint list
- Recommended folder structure`,
  },
  {
    id: 2,
    title: "Code Generation",
    category: "Code Generation",
    description: "Generate production-ready code",
    template: `Role:
You are a senior software engineer specializing in [e.g. backend development / React / Python].

Context:
I am building a [describe the feature or module — e.g. user authentication system] for a [describe the app — e.g. task management web app]. This feature needs to [describe the goal — e.g. allow users to register, log in, and receive a JWT token].

Tech Stack:
- Language: [e.g. TypeScript]
- Framework: [e.g. ASP.NET Core / Express / Next.js]
- Database: [e.g. PostgreSQL]

Features:
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

Constraints:
- No external authentication libraries (e.g. no Auth0)
- Code must follow REST conventions
- Include input validation

Expected Output:
- Complete, working code with comments
- Explanation of key implementation decisions
- Edge cases handled`,
  },
  {
    id: 3,
    title: "Debugging Help",
    category: "Debugging",
    description: "Diagnose and fix code issues",
    template: `Role:
You are an expert debugger and senior software engineer.

Context:
I am working on a [describe the project — e.g. React + ASP.NET Core web app]. I encountered the following error:

[Paste the full error message here]

Here is the relevant code:
[Paste the code block here]

Tech Stack:
- Language: [e.g. C# / JavaScript]
- Framework: [e.g. ASP.NET Core / React]
- Runtime / Version: [e.g. .NET 10 / Node 20]

Features:
- [Describe what the code is supposed to do]

Constraints:
- Do not change the overall architecture
- Fix must be backward compatible

Expected Output:
- Identified root cause of the error
- Step-by-step fix with corrected code
- Explanation of why the error occurred and how to prevent it`,
  },
  {
    id: 4,
    title: "Learning / Explanation",
    category: "Learning",
    description: "Learn a concept with clear examples",
    template: `Role:
You are an expert teacher and senior software engineer who explains complex topics in simple terms.

Context:
I want to understand [describe the concept — e.g. how JWT authentication works]. I am a [Beginner / Intermediate / Advanced] developer. My goal is to [describe what you want to be able to do — e.g. implement JWT auth in my own API].

Tech Stack:
- Language: [e.g. JavaScript / C#]
- Framework: [e.g. Express / ASP.NET Core]

Features:
- Explain the concept from first principles
- Use real-world analogies where helpful
- Show a practical code example

Constraints:
- Avoid jargon — use plain language
- Keep the explanation under 500 words
- Use only the technologies listed above

Expected Output:
- Clear step-by-step explanation
- Working code example with comments
- Common mistakes to avoid
- One recommended resource for further learning`,
  },
  {
    id: 5,
    title: "Content Writing",
    category: "Content Writing",
    description: "Write structured, high-quality content",
    template: `Role:
You are a professional content writer and technical communicator with expertise in [e.g. software development / marketing / education].

Context:
I need to write [describe the content — e.g. a blog post about prompt engineering for developers]. The target audience is [describe readers — e.g. junior developers who are new to AI tools]. The purpose is to [describe the goal — e.g. teach readers how to write better prompts].

Tech Stack:
- Format: [e.g. Blog post / README / LinkedIn article / Email]
- Tone: [e.g. Professional and approachable]
- Length: [e.g. 600–800 words]

Features:
- Engaging introduction that hooks the reader
- Clear sections with subheadings
- Practical examples included
- Strong call to action at the end

Constraints:
- No filler phrases like "In today's world..." or "In conclusion..."
- Use active voice throughout
- Avoid technical jargon unless explained

Expected Output:
- Complete draft of the content ready to publish
- Suggested title and meta description
- 3 alternative headline options`,
  },
  {
    id: 6,
    title: "AI Agent Design",
    category: "AI Agent Design",
    description: "Design an AI agent or chatbot system",
    template: `Role:
You are a senior AI systems architect with expertise in LLM-powered applications and prompt engineering.

Context:
I am building an AI agent that [describe the agent's purpose — e.g. helps users write better prompts for AI tools]. The agent will be used by [describe users — e.g. developers and students who are new to AI]. The goal is to [describe the outcome — e.g. guide users through a structured conversation and produce a high-quality prompt].

Tech Stack:
- AI Model: [e.g. Llama3 via Groq API]
- Backend: [e.g. ASP.NET Core]
- Frontend: [e.g. React]
- Database: [e.g. PostgreSQL on Neon]

Features:
- Conversational clarification flow
- Structured prompt generation using RCCE framework
- Prompt scoring and feedback
- Prompt history and templates

Constraints:
- Use free-tier AI and hosting services only
- No paid APIs
- Must be usable by non-technical users

Expected Output:
- Agent architecture overview
- Prompt engineering strategy and system prompt design
- API endpoint design for agent interactions
- Step-by-step implementation plan`,
  },
];

export default function Templates() {
  const [copied, setCopied] = useState(null);
  const navigate = useNavigate();

  const handleUse = (template) => {
    sessionStorage.setItem("templatePrompt", template.template);
    navigate("/");
  };

  const handleCopy = (template) => {
    navigator.clipboard.writeText(template.template);
    setCopied(template.id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-4">
        <FaLayerGroup className="text-purple-400 text-2xl" />
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Prompt Templates
        </h1>
      </div>
      <p className="text-slate-400 mb-8">
        Pick a template to quickly generate high-quality prompts.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((t) => (
          <div
            key={t.id}
            className="rounded-2xl p-5 border border-purple-900/40 flex flex-col gap-3"
            style={{ background: "var(--bg-card)" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-slate-200">{t.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{t.description}</p>
              </div>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/50 shrink-0 ml-2">
                {t.category}
              </span>
            </div>
            <pre className="text-xs text-slate-400 bg-slate-900/50 rounded-lg p-3 overflow-auto max-h-32 whitespace-pre-wrap">
              {t.template}
            </pre>
            <div className="flex gap-2 mt-auto pt-1">
              <button
                onClick={() => handleUse(t)}
                className="flex-1 py-2 rounded-lg bg-purple-700 hover:bg-purple-600 text-white text-sm font-medium transition-colors"
              >
                Use in Playground
              </button>
              <button
                onClick={() => handleCopy(t)}
                className="px-4 py-2 rounded-lg border border-purple-700/50 hover:bg-purple-900/40 text-slate-300 text-sm transition-colors"
              >
                {copied === t.id ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
