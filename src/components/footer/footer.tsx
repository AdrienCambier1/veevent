import "./footer.scss";
import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Instagram,
  Twitter,
  Facebook,
} from "iconoir-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Section principale */}
        <div className="footer-main">
          {/* Logo et description */}
          <div className="footer-brand">
            <img src="/veevent.svg" alt="Veevent" className="footer-logo" />
            <p className="footer-description">
              Découvrez, réservez et profitez des meilleurs événements près de
              chez vous. Concerts, festivals, ateliers et bien plus encore !
            </p>
            <div className="footer-socials">
              <Link href="#" className="social-link">
                <Instagram />
              </Link>
              <Link href="#" className="social-link">
                <Twitter />
              </Link>
              <Link href="#" className="social-link">
                <Facebook />
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-nav">
            <div className="nav-section">
              <h4>Découvrir</h4>
              <ul>
                <li>
                  <Link href="/evenements">Événements</Link>
                </li>
                <li>
                  <Link href="/lieux">Lieux</Link>
                </li>
                <li>
                  <Link href="/villes">Villes</Link>
                </li>
                <li>
                  <Link href="/organisateurs">Organisateurs</Link>
                </li>
              </ul>
            </div>

            <div className="nav-section">
              <h4>Catégories</h4>
              <ul>
                <li>
                  <Link href="/evenements?categories=musique">Musique</Link>
                </li>
                <li>
                  <Link href="/evenements?categories=theatre">Théâtre</Link>
                </li>
                <li>
                  <Link href="/evenements?categories=festivals">Festivals</Link>
                </li>
                <li>
                  <Link href="/evenements?categories=culture">
                    Art & Culture
                  </Link>
                </li>
              </ul>
            </div>

            <div className="nav-section">
              <h4>Support</h4>
              <ul>
                <li>
                  <Link href="/aide">Centre d'aide</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/conditions">Conditions d'utilisation</Link>
                </li>
                <li>
                  <Link href="/confidentialite">Confidentialité</Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="footer-contact">
            <h4>Nous contacter</h4>
            <div className="contact-info">
              <div className="contact-item">
                <MapPin />
                <span>Sophia Antipolis, France</span>
              </div>
              <div className="contact-item">
                <Mail />
                <span>contact@veevent.fr</span>
              </div>
              <div className="contact-item">
                <Phone />
                <span>+33 4 XX XX XX XX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Barre du bas */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>&copy; 2025 Veevent. Tous droits réservés.</p>
            <div className="footer-bottom-links">
              <Link href="/mentions-legales">Mentions légales</Link>
              <Link href="/cookies">Cookies</Link>
              <Link href="/plan-du-site">Plan du site</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
