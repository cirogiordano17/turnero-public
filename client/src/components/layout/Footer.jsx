import "./styles/footer.css";
import { CONTACT } from "../../config/contact";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__container">
        <p className="site-footer__brand">{CONTACT.salonName}</p>
        <p className="site-footer__copy">Hecho con ❤️ © 2026</p>
      </div>
    </footer>
  );
}