import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLightbulb } from "react-icons/fa";

const tips = [
  {
    title: "Always assign a Role",
    body: 'Start every prompt with "You are a [specific expert]..." — this shapes the AI\'s tone, depth, and perspective. "You are a senior database architect" gets better results than no role at all.',
  },
  {
    title: "Define your Expected Output",
    body: 'Tell the AI exactly what to return. "Give me a database schema, API endpoints, and a folder structure" is far more effective than just describing a feature.',
  },
  {
    title: "Add Constraints to score higher",
    body: 'Constraints remove ambiguity. Examples: "Use free-tier services only", "No external libraries", "Keep the response under 300 words", "Must support mobile devices".',
  },
  {
    title: "Context is more than Tech Stack",
    body: "Context means WHY and for WHO — not just what tech you use. Describe the problem domain, the users, and the purpose. Tech stack is a separate concern.",
  },
  {
    title: "Be specific, not vague",
    body: '"Build a login system" scores ~10/100. "You are a senior backend engineer. Build a JWT-based auth system for a React + Node.js app with refresh token rotation." scores 70+.',
  },
  {
    title: "Use the RCCE framework",
    body: "Every great prompt has four parts: Role (who the AI is), Context (what the problem is), Constraints (what limits apply), Expected Output (what you want back). Missing any one drops your score by 25 points.",
  },
  {
    title: "Copy & paste into any AI",
    body: "Once your prompt is improved and scored, copy it and paste it directly into ChatGPT, Claude, Gemini, or any other AI — the structure works everywhere.",
  },
];

export default function TipSlideshow() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % tips.length);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="mb-6">
      <div
        className="rounded-2xl border border-purple-900/30 px-5 py-4 relative overflow-hidden"
        style={{ background: "var(--bg-card)" }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <FaLightbulb className="text-yellow-400 shrink-0" size={13} />
          <span className="text-xs font-semibold uppercase tracking-widest text-yellow-400">
            Prompt Engineering Tip
          </span>
          <span className="ml-auto text-xs text-slate-600">
            {current + 1} / {tips.length}
          </span>
        </div>

        {/* Slide */}
        <div className="min-h-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm font-semibold text-slate-200 mb-1">
                {tips[current].title}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                {tips[current].body}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex items-center gap-1.5 mt-4">
          {tips.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === current
                  ? "bg-purple-500 w-5"
                  : "bg-slate-700 hover:bg-slate-500 w-1.5"
              }`}
              aria-label={`Tip ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
