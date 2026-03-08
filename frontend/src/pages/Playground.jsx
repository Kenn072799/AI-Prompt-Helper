import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { promptApi } from "../services/api";
import ScoreCard from "../components/ScoreCard";
import PromptResult from "../components/PromptResult";
import HeroSection from "../components/HeroSection";
import TipSlideshow from "../components/TipSlideshow";

export default function Playground() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [input]);

  useEffect(() => {
    const template = sessionStorage.getItem("templatePrompt");
    if (template) {
      setInput(template);
      sessionStorage.removeItem("templatePrompt");
    }
  }, []);

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const data = await promptApi.analyze(input.trim());
      setResult(data);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Something went wrong. Check your API key and database connection.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Hero */}
      <HeroSection />

      {/* Tip slideshow */}
      <TipSlideshow />

      {/* Input area */}
      <div
        className="rounded-2xl p-4 sm:p-6 border border-purple-900/40 mb-6"
        style={{ background: "var(--bg-card)" }}
      >
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Your Prompt
        </label>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write your prompt here..."
          rows={5}
          maxLength={2000}
          className="w-full bg-slate-900/60 max-h-100 border border-purple-900/40 rounded-xl px-4 py-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none overflow-y-auto text-sm leading-relaxed"
        />
        {!input.trim() && (
          <p className="text-xs text-slate-500 mt-2">
            Not sure what to write?{" "}
            <Link
              to="/templates"
              className="text-purple-400 hover:text-purple-300 underline underline-offset-2 transition-colors"
            >
              Browse our templates
            </Link>{" "}
            to get started quickly.
          </p>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <span
            className={`text-xs ${input.length >= 1800 ? "text-red-400" : "text-slate-500"}`}
          >
            {input.length} / 2000 characters
          </span>
          <button
            onClick={handleAnalyze}
            disabled={loading || !input.trim()}
            className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            <FaWandMagicSparkles />
            {loading ? "Analyzing..." : "Analyze & Improve"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-900/30 border border-red-700/50 text-red-300 text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-10 h-10 border-4 border-purple-700 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PromptResult result={result} />
          </div>
          <div>
            <ScoreCard
              score={result.score}
              scoreBreakdown={result.scoreBreakdown}
              strengths={result.strengths}
              weaknesses={result.weaknesses}
              suggestions={result.suggestions}
            />
          </div>
        </div>
      )}
    </div>
  );
}
