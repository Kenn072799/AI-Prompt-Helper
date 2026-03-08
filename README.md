# 🪄 AI Prompt Helper

**AI Prompt Helper** is a full-stack web application that helps users write better prompts for AI tools like ChatGPT, Claude, and Gemini. It analyzes your prompt, scores it using the **RCCE framework**, identifies strengths and weaknesses, and rewrites it into a structured, high-quality prompt you can use immediately.

🔗 **Live Demo:** [https://ai-prompt-helper.vercel.app](https://ai-prompt-helper.vercel.app)  
🔗 **API:** [https://ai-prompt-helper.onrender.com/health](https://ai-prompt-helper.onrender.com/health)

---

## Features

- **Prompt Analyzer** — Paste any rough idea and get an AI-improved version instantly
- **RCCE Scoring** — Every prompt is scored across 4 dimensions: Role, Context, Constraints, and Expected Output (0–100)
- **Score Breakdown** — Visual progress bars show exactly where your prompt is weak
- **Prompt Templates** — 6 ready-to-use templates: System Design, Code Generation, Debugging, Learning, Content Writing, and AI Agent Design
- **Prompt Trends** — See real-time analytics on what categories users are submitting most
- **Prompt History** — All analyzed prompts are saved to the database
- **Tip Slideshow** — 7 rotating prompt engineering tips on the home page
- **Mobile Responsive** — Works on all screen sizes with a hamburger navbar

---

## Tech Stack

| Layer            | Technology                         |
| ---------------- | ---------------------------------- |
| Frontend         | React 18 + Vite                    |
| Styling          | Tailwind CSS v4                    |
| Animations       | Framer Motion                      |
| Icons            | React Icons                        |
| HTTP Client      | Axios                              |
| Routing          | React Router DOM                   |
| Backend          | ASP.NET Core (.NET 10)             |
| Language         | C#                                 |
| ORM              | Entity Framework Core 10           |
| Database         | PostgreSQL (Neon Serverless)       |
| AI Model         | `openai/gpt-oss-120b` via Groq API |
| Containerization | Docker                             |
| Frontend Hosting | Vercel                             |
| Backend Hosting  | Render                             |

---

## Prompt Engineering — RCCE Framework

Every prompt is evaluated across 4 dimensions (25 points each):

| Dimension           | What it measures                                                     |
| ------------------- | -------------------------------------------------------------------- |
| **R**ole            | Does the prompt assign a specific expert persona to the AI?          |
| **C**ontext         | Is the problem domain, purpose, and scope clearly explained?         |
| **C**onstraints     | Are there explicit limits — budget, tech, time, response format?     |
| **E**xpected Output | Does the prompt define what the AI should return and in what format? |

---

## Project Structure

```
project01_ai_prompt_helper_project/
├── frontend/                  # React + Vite app
│   ├── src/
│   │   ├── components/        # Navbar, Footer, HeroSection, ScoreCard, TipSlideshow, PromptResult
│   │   ├── pages/             # Playground, Templates, History (Trends)
│   │   └── services/          # api.js (Axios)
│   ├── vercel.json            # SPA routing config for Vercel
│   └── index.html
│
└── backend/                   # ASP.NET Core Web API
    ├── Controllers/           # PromptsController
    ├── Services/              # PromptService, IPromptService
    ├── DTOs/                  # AnalyzeRequest, AnalyzeResponse, ScoreBreakdown, TrendsResponse
    ├── Models/                # Prompt entity
    ├── Data/                  # AppDbContext (EF Core)
    ├── Migrations/            # EF Core migrations
    ├── Prompts/               # analyze_prompt.txt, trends_prompt.txt (AI system prompts)
    ├── Dockerfile
    └── Program.cs
```

---

## Getting Started Locally

### Prerequisites

- Node.js 20+
- .NET 10 SDK
- A [Neon](https://neon.tech) PostgreSQL database (free)
- A [Groq](https://console.groq.com) API key (free)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/ai-prompt-helper.git
cd ai-prompt-helper
```

### 2. Run the backend

Create `backend/appsettings.Development.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "your-neon-connection-string"
  },
  "Groq": {
    "ApiKey": "your-groq-api-key"
  }
}
```

```bash
cd backend
dotnet restore
dotnet run
```

The API will start at `http://localhost:5000`.

### 3. Run the frontend

```bash
cd frontend
npm install
npm run dev
```

The app will open at `http://localhost:5173`.

---

## API Endpoints

| Method | Endpoint               | Description                     |
| ------ | ---------------------- | ------------------------------- |
| `POST` | `/api/prompts/analyze` | Analyze and improve a prompt    |
| `GET`  | `/api/prompts/history` | Get all saved prompts           |
| `GET`  | `/api/prompts/trends`  | Get AI-generated trend analysis |
| `GET`  | `/api/prompts/{id}`    | Get a specific prompt by ID     |
| `GET`  | `/health`              | Health check                    |

Rate limit: **10 requests per minute** on the analyze endpoint.

---

## Deployment

### Backend → Render

1. Push to GitHub
2. New Web Service → Docker → Root directory: `backend`
3. Add environment variables:
   - `ConnectionStrings__DefaultConnection`
   - `Groq__ApiKey`
   - `AllowedOrigins__0` → your Vercel URL

### Frontend → Vercel

1. New Project → Root directory: `frontend` → Framework: Vite
2. Add environment variable:
   - `VITE_API_URL` → your Render URL (e.g. `https://ai-prompt-helper.onrender.com`)

---

## Security

- Secrets are stored in environment variables — never in source code
- Rate limiting protects the Groq API quota from abuse
- CORS is restricted to the configured frontend origin only
- Server errors return generic messages — no internal details exposed to clients
- Input length validated server-side (max 5,000 characters)

---

## Author

**Kenneth Altes**

---

## License

MIT
