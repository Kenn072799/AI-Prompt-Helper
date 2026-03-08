import { useState } from "react";
import { motion } from "framer-motion";
import { FaCopy, FaCheck } from "react-icons/fa";

const SECTION_LABELS = [
  "Role:",
  "Context:",
  "Tech Stack:",
  "Features:",
  "Constraints:",
  "Expected Output:",
];

function renderPrompt(text) {
  // Split into blocks by blank lines
  const blocks = text
    .split(/\n\s*\n/)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((block, i) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);
    if (lines.length === 0) return null;

    const firstLine = lines[0];
    const isSection = SECTION_LABELS.some((label) =>
      firstLine.startsWith(label),
    );

    if (isSection) {
      const rest = lines.slice(1);
      return (
        <div key={i} className="mb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">
            {firstLine.replace(":", "")}
          </p>
          {rest.map((line, j) => {
            const isBullet = line.startsWith("- ");
            return isBullet ? (
              <div
                key={j}
                className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed ml-1"
              >
                <span className="text-purple-500 mt-0.5 shrink-0">•</span>
                <span>{line.slice(2)}</span>
              </div>
            ) : (
              <p key={j} className="text-sm text-slate-300 leading-relaxed">
                {line}
              </p>
            );
          })}
        </div>
      );
    }

    // Non-section block — render lines normally
    return (
      <div key={i} className="mb-3">
        {lines.map((line, j) => {
          const isBullet = line.startsWith("- ");
          return isBullet ? (
            <div
              key={j}
              className="flex items-start gap-2 text-sm text-slate-300 leading-relaxed ml-1"
            >
              <span className="text-purple-500 mt-0.5 shrink-0">•</span>
              <span>{line.slice(2)}</span>
            </div>
          ) : (
            <p key={j} className="text-sm text-slate-300 leading-relaxed">
              {line}
            </p>
          );
        })}
      </div>
    );
  });
}

export default function PromptResult({ result }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result.improvedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-6 border border-purple-900/40"
      style={{ background: "var(--bg-card)" }}
    >
      <div className="flex flex-wrap items-start justify-between gap-2 mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-slate-200">
          Improved Prompt
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/50">
            {result.category}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-600 text-white transition-colors"
          >
            {copied ? <FaCheck size={12} /> : <FaCopy size={12} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 rounded-xl p-5 overflow-auto max-h-96">
        {renderPrompt(result.improvedPrompt)}
      </div>
    </motion.div>
  );
}
