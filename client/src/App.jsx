import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import PeluPage from "./pages/PeluPage";
import AkashicosPage from "./pages/AkashicosPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/peluqueria" element={<PeluPage />} />
      <Route path="/akashicos" element={<AkashicosPage />} />
    </Routes>
  );
}

export default App;