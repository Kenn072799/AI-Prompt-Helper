export default function Footer() {
  return (
    <footer
      className="text-center py-6 px-4 text-xs text-slate-600 border-t border-slate-800"
      style={{ background: "var(--bg-primary)" }}
    >
      &copy; {new Date().getFullYear()} Kenneth Altes. All rights reserved.
    </footer>
  );
}
