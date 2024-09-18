import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import WritePage from "./pages/WritePage/WritePage";
import InstructionsPage from "./pages/InstructionsPage/InstructionsPage";
import AboutPage from "./pages/AboutPage/AboutPage";
// import Test from "./pages/Test/Test";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/write" element={<WritePage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/about" element={<AboutPage />} />
        {/* <Route path="/test" element={<Test />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
