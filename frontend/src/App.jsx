import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Playground from "./pages/Playground";
import Trends from "./pages/History";
import Templates from "./pages/Templates";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main
        className="pt-16 min-h-screen"
        style={{ background: "var(--bg-primary)" }}
      >
        <Routes>
          <Route path="/" element={<Playground />} />
          <Route path="/trends" element={<Trends />} />
          <Route path="/templates" element={<Templates />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
