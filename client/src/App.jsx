import { useState } from "react";
import LandingPage from "./pages/LandingPage";
import BookingView from "./components/booking/BookingView";

function App() {
  const [currentView, setCurrentView] = useState("landing");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleOpenBooking = (category = null) => {
    setSelectedCategory(category);
    setCurrentView("booking");
  };

  const handleBackToLanding = () => {
    setCurrentView("landing");
    setSelectedCategory(null);
  };

  return currentView === "landing" ? (
    <LandingPage onOpenBooking={handleOpenBooking} />
  ) : (
    <BookingView
      selectedCategory={selectedCategory}
      onSelectCategory={setSelectedCategory}
      onBack={handleBackToLanding}
    />
  );
}

export default App;