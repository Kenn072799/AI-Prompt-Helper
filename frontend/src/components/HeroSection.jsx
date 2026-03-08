import { motion } from "framer-motion";

const features = [
  {
    label: "RCCE Analysis",
    description:
      "Evaluates your prompt across four dimensions: Role, Context, Constraints, and Expected Output — the core pillars of effective prompt engineering.",
  },
  {
    label: "Prompt Scoring",
    description:
      "Assigns a quality score based on clarity, specificity, and structural completeness so you know exactly where your prompt stands.",
  },
  {
    label: "Structured Rewrite",
    description:
      "Transforms vague instructions into a well-defined prompt with explicit role assignments, context framing, and output specifications.",
  },
];

export default function HeroSection() {
  return (
    <div className="text-center mb-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block mb-3 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-purple-900/40 text-purple-400 border border-purple-700/40"
      >
        Prompt Engineering Assistant
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="text-3xl sm:text-4xl font-bold text-white mb-3"
      >
        AI Prompt Helper
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-slate-400 text-base sm:text-lg max-w-2xl mx-auto mb-6 leading-relaxed px-2"
      >
        Most AI responses are only as good as the prompt behind them. This tool
        acts as your prompt engineering co-pilot — it diagnoses weak prompts,
        fills in missing structure, and rewrites them into precise, high-signal
        instructions that get better results from any AI model. Once improved,
        copy your prompt and paste it directly into ChatGPT, Claude, Gemini, or
        any AI tool of your choice.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left"
      >
        {features.map((f) => (
          <div
            key={f.label}
            className="rounded-xl p-4 border border-purple-900/30 bg-purple-950/20"
          >
            <p className="text-purple-400 font-semibold text-sm mb-1">
              {f.label}
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
