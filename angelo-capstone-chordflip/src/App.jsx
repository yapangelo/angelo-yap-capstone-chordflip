import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import WritePage from "./pages/WritePage/WritePage";
import InstructionsPage from "./pages/InstructionsPage/InstructionsPage";
import AboutPage from "./pages/AboutPage/AboutPage";
import SimpleTextEditor from "./pages/SimpleTextEditor/SimpleTextEditor";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/test" element={<SimpleTextEditor />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
