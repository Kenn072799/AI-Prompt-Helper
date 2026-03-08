import { motion } from "framer-motion";

const colorForScore = (score) => {
  if (score >= 75) return "#22c55e";
  if (score >= 50) return "#eab308";
  return "#ef4444";
};

const DIMENSIONS = [
  { key: "role", label: "Role" },
  { key: "context", label: "Context" },
  { key: "constraints", label: "Constraints" },
  { key: "expectedOutput", label: "Expected Output" },
];

export default function ScoreCard({
  score,
  scoreBreakdown = null,
  strengths = [],
  weaknesses = [],
  suggestions = [],
}) {
  const color = colorForScore(score);
  const circumference = 2 * Math.PI * 45;
  const strokeDash = (score / 100) * circumference;

  return (
    <div
      className="rounded-2xl p-6 border border-purple-900/40"
      style={{ background: "var(--bg-card)" }}
    >
      <h3 className="text-lg font-semibold text-slate-200 mb-4">
        Prompt Score
      </h3>

      {/* Circular progress */}
      <div className="flex justify-center mb-6">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#1e1b4b"
              strokeWidth="8"
            />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: circumference - strokeDash }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold" style={{ color }}>
              {score}
            </span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
        </div>
      </div>

      {/* RCCE Breakdown */}
      {scoreBreakdown && (
        <div className="mb-5">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            RCCE Breakdown
          </p>
          <div className="space-y-2">
            {DIMENSIONS.map(({ key, label }) => {
              const val = scoreBreakdown[key] ?? 0;
              const pct = (val / 25) * 100;
              const barColor =
                val >= 20 ? "#22c55e" : val >= 10 ? "#eab308" : "#ef4444";
              return (
                <div key={key}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{label}</span>
                    <span className="font-medium" style={{ color: barColor }}>
                      {val} / 25
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: barColor }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-green-400 uppercase tracking-wider mb-2">
            Strengths
          </p>
          <ul className="space-y-1">
            {strengths.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="text-green-400 mt-0.5">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-2">
            Weaknesses
          </p>
          <ul className="space-y-1">
            {weaknesses.map((w, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="text-red-400 mt-0.5">✗</span> {w}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-yellow-400 uppercase tracking-wider mb-2">
            Suggestions
          </p>
          <ul className="space-y-1">
            {suggestions.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-sm text-slate-300"
              >
                <span className="text-yellow-400 mt-0.5">→</span> {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
