import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
      <ToastContainer
        position="top-right"
        theme="dark"
        toastStyle={{
          background: "#0f1729",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "0.75rem",
          color: "#e2e8f0",
        }}
      />
    </BrowserRouter>
  );
}

export default App;

