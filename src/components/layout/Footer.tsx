import { Link } from "react-router-dom";
import { Leaf, MapPin, Mail, Phone, Facebook, Twitter, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-lg leading-none">FIAA</span>
                <span className="text-xs text-primary-foreground/60">2026</span>
              </div>
            </div>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              Festival International de l'Agriculture et de l'Agroalimentaire - Connecter la Terre et la Tech pour une Agriculture Africaine d'Avenir.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Liens Rapides</h4>
            <ul className="space-y-2">
              {[
                { label: "Accueil", href: "/" },
                { label: "Programme", href: "/programme" },
                { label: "Inscription", href: "/inscription" },
                { label: "Partenaires", href: "/sponsors" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Participants */}
          <div>
            <h4 className="font-display font-semibold mb-4">Participants</h4>
            <ul className="space-y-2">
              {[
                "Agriculteurs",
                "Startups Agritech",
                "Partenaires & Sponsors",
                "Institutions",
                "Médias & Presse",
              ].map((item) => (
                <li key={item}>
                  <span className="text-primary-foreground/70 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-accent" />
                <span className="text-primary-foreground/70 text-sm">
                  Agbélouvé, Région Maritime, Togo
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent" />
                <a href="mailto:contact@fiaa2026.tg" className="text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">
                  contact@fiaa2026.tg
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-accent" />
                <a href="tel:+22890000000" className="text-primary-foreground/70 text-sm hover:text-primary-foreground transition-colors">
                  +228 90 00 00 00
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/50 text-sm">
            © 2026 FIAA - Festival International de l'Agriculture et de l'Agroalimentaire. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link to="/mentions-legales" className="text-primary-foreground/50 text-sm hover:text-primary-foreground transition-colors">
              Mentions légales
            </Link>
            <Link to="/confidentialite" className="text-primary-foreground/50 text-sm hover:text-primary-foreground transition-colors">
              Confidentialité
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
