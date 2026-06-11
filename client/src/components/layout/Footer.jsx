import "./styles/footer.css";
import { CONTACT } from "../../config/contact";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer__container">

        <div className="site-footer__brand-col">
          <p className="site-footer__name">{CONTACT.salonName}</p>
          <p className="site-footer__location">{CONTACT.city}, {CONTACT.province}</p>
        </div>

        <div className="site-footer__cols">
          <div className="site-footer__col">
            <p className="site-footer__col-title">Contacto</p>
            <a className="site-footer__link" href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a>
            <a
              className="site-footer__link"
              href={`https://wa.me/${CONTACT.whatsapp}`}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
            <a
              className="site-footer__link"
              href={CONTACT.instagramUrl}
              target="_blank"
              rel="noreferrer"
            >
              {CONTACT.instagram}
            </a>
          </div>

        </div>

      </div>

      <div className="site-footer__bottom">
        <p>© {year} {CONTACT.salonName}. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}
