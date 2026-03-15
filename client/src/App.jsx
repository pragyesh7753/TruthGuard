import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Detector from "./pages/Detector";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* All pages share the MainLayout (Navbar + wrapper) */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/detector" element={<Detector />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
