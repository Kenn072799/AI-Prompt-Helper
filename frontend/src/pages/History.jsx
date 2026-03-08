import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { promptApi } from "../services/api";
import { FaFire } from "react-icons/fa";

const categoryColors = {
  "System Design": {
    bg: "bg-blue-900/40",
    border: "border-blue-700/50",
    text: "text-blue-300",
  },
  "Code Generation": {
    bg: "bg-green-900/40",
    border: "border-green-700/50",
    text: "text-green-300",
  },
  Debugging: {
    bg: "bg-red-900/40",
    border: "border-red-700/50",
    text: "text-red-300",
  },
  Learning: {
    bg: "bg-yellow-900/40",
    border: "border-yellow-700/50",
    text: "text-yellow-300",
  },
  "Content Writing": {
    bg: "bg-pink-900/40",
    border: "border-pink-700/50",
    text: "text-pink-300",
  },
  "AI Agent Design": {
    bg: "bg-purple-900/40",
    border: "border-purple-700/50",
    text: "text-purple-300",
  },
  General: {
    bg: "bg-slate-800/40",
    border: "border-slate-700/50",
    text: "text-slate-300",
  },
};

const CACHE_KEY = "trends_cache";
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function readLocalCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, cachedAt } = JSON.parse(raw);
    if (Date.now() - cachedAt > CACHE_TTL_MS) return null;
    return { data, cachedAt };
  } catch {
    return null;
  }
}

function writeLocalCache(data) {
  try {
    localStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ data, cachedAt: Date.now() }),
    );
  } catch {
    // storage quota exceeded — ignore
  }
}

function formatAge(cachedAt) {
  const mins = Math.floor((Date.now() - cachedAt) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

const getColor = (cat) => categoryColors[cat] ?? categoryColors["General"];

export default function Trends() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cachedAt, setCachedAt] = useState(null);
  const [, tick] = useState(0); // forces re-render for age display

  // refresh age label every minute
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 60000);
    return () => clearInterval(id);
  }, []);

  const fetchTrends = (force = false) => {
    if (!force) {
      const cached = readLocalCache();
      if (cached) {
        setData(cached.data);
        setCachedAt(cached.cachedAt);
        setLoading(false);
        return;
      }
    } else {
      localStorage.removeItem(CACHE_KEY);
    }

    setLoading(true);
    setError("");
    promptApi
      .getTrends(force)
      .then((d) => {
        setData(d);
        const now = Date.now();
        setCachedAt(now);
        writeLocalCache(d);
      })
      .catch(() =>
        setError(
          "Could not load trends. Make sure you have analyzed some prompts first.",
        ),
      )
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTrends(false);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
        <div className="flex items-center gap-3">
          <FaFire className="text-orange-400 text-2xl" />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              What's Trending
            </h1>
            {cachedAt && !loading && (
              <p className="text-xs text-slate-500 mt-0.5">
                Last updated {formatAge(cachedAt)} · refreshes every hour
              </p>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex justify-center pt-24">
          <div className="w-10 h-10 border-4 border-purple-700 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && <div className="text-center py-20 text-slate-500">{error}</div>}

      {data && !loading && (
        <>
          {/* AI Insight */}
          {data.insight && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl p-5 border border-orange-700/40 mb-8"
              style={{ background: "var(--bg-card)" }}
            >
              <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-2">
                AI Insight
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                {data.insight}
              </p>
              <p className="text-xs text-slate-500 mt-3">
                Based on {data.totalPrompts} prompt
                {data.totalPrompts !== 1 ? "s" : ""} analyzed
              </p>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Trending Topics */}
            <div className="lg:col-span-2">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                Trending Topics
              </p>
              {data.totalPrompts === 0 ? (
                <div className="text-center py-16 text-slate-500 text-sm">
                  No prompts yet — go to the Playground and analyze some
                  prompts!
                </div>
              ) : (
                <div className="space-y-3">
                  {data.trendingTopics.map((topic, i) => {
                    const colors = getColor(topic.category);
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`rounded-xl p-4 border ${colors.bg} ${colors.border}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p
                              className={`font-semibold text-sm ${colors.text}`}
                            >
                              {topic.topic}
                            </p>
                            <p className="text-slate-400 text-sm mt-1 leading-relaxed">
                              {topic.description}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full border shrink-0 ${colors.bg} ${colors.border} ${colors.text}`}
                          >
                            {topic.category}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Category Breakdown */}
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                Category Breakdown
              </p>
              <div
                className="rounded-2xl p-4 border border-purple-900/40 space-y-4"
                style={{ background: "var(--bg-card)" }}
              >
                {data.categoryStats.length === 0 ? (
                  <p className="text-slate-500 text-sm text-center py-4">
                    No data yet
                  </p>
                ) : (
                  data.categoryStats.map((stat, i) => {
                    const colors = getColor(stat.category);
                    return (
                      <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className={`font-medium ${colors.text}`}>
                            {stat.category}
                          </span>
                          <span className="text-slate-400">
                            {stat.count} · avg {stat.avgScore}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-slate-800 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.percentage}%` }}
                            transition={{
                              duration: 0.8,
                              delay: i * 0.1,
                              ease: "easeOut",
                            }}
                            className="h-full rounded-full bg-purple-600"
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
