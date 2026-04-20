import "../styles/pages/landing.css";
import Hero from "../components/layout/Hero";
import ServicesSection from "../components/layout/ServicesSection";
import ExperienceSection from "../components/layout/ExperienceSection";
import StepsSection from "../components/layout/StepsSection";
import ResultsSection from "../components/layout/ResultsSection";
import ContactSection from "../components/layout/ContactSection";
import Footer from "../components/layout/Footer";

function LandingPage({ onOpenBooking }) {
  return (
    <>
      <Hero onOpenBooking={onOpenBooking} />
      <ExperienceSection />
      <StepsSection />
      <ResultsSection />
      <ServicesSection onOpenBooking={onOpenBooking} />
      <ContactSection />
      <Footer />
    </>
  );
}

export default LandingPage;