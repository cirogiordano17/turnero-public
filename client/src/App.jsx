import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import BookingView from "./components/booking/BookingView";
import AdminPage from "./admin/pages/AdminPage";

function App() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleOpenBooking = (category = null) => {
    setSelectedCategory(category);
    navigate("/reservar");
  };

  const handleBackToLanding = () => {
    setSelectedCategory(null);
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={<LandingPage onOpenBooking={handleOpenBooking} />}
      />

      <Route
        path="/reservar"
        element={
          <BookingView
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            onBack={handleBackToLanding}
          />
        }
      />

      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
}

export default App;