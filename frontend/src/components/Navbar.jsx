import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBolt, FaBars, FaXmark } from "react-icons/fa6";

const navLinks = [
  { path: "/", label: "Playground" },
  { path: "/trends", label: "Trends" },
  { path: "/templates", label: "Templates" },
];

export default function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 border-b border-purple-900/40"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-lg text-purple-300"
          onClick={() => setMenuOpen(false)}
        >
          <FaBolt className="text-purple-400" />
          PromptHelper AI
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex gap-1">
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === path
                  ? "bg-purple-700 text-white"
                  : "text-slate-400 hover:text-white hover:bg-purple-900/40"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-purple-900/40 transition-colors"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div
          className="sm:hidden border-t border-purple-900/40 px-4 py-3 flex flex-col gap-1"
          style={{ background: "var(--bg-secondary)" }}
        >
          {navLinks.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === path
                  ? "bg-purple-700 text-white"
                  : "text-slate-400 hover:text-white hover:bg-purple-900/40"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
