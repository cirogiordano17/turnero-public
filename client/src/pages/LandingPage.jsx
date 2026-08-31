import "../styles/pages/landing.css";
import Navbar from "../components/layout/Navbar";
import Hero from "../components/layout/Hero";
import ServicesSection from "../components/layout/ServicesSection";
import ExperienceSection from "../components/layout/ExperienceSection";
import ContactSection from "../components/layout/ContactSection";
import Footer from "../components/layout/Footer";

function LandingPage({ onOpenBooking }) {
  return (
    <>
      <Navbar />
      <Hero onOpenBooking={onOpenBooking} />
      <ExperienceSection />
      <ServicesSection onOpenBooking={onOpenBooking} />
      <ContactSection />
      <Footer />
    </>
  );
}

export default LandingPage;