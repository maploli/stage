import { motion } from "framer-motion";
import { Lightbulb, GraduationCap, Building, Coffee } from "lucide-react";

const zones = [
  {
    icon: Lightbulb,
    name: "Zone Innovation",
    percentage: "40%",
    features: ["Stands startups (30 unités)", "Lab d'expérimentation tech", "Espace pitch et démonstrations", "Zone prototypage rapide"],
    color: "primary",
  },
  {
    icon: GraduationCap,
    name: "Zone Formation",
    percentage: "25%",
    features: ["Ateliers pratiques (5 salles)", "Demo centers thématiques", "Espace coworking collaboratif", "Lab digital mobile"],
    color: "accent",
  },
  {
    icon: Building,
    name: "Zone Institutionnelle",
    percentage: "20%",
    features: ["Pavillon partenaires stratégiques", "Espace institutions publiques", "Zone investisseurs", "Point presse et médias"],
    color: "purple",
  },
  {
    icon: Coffee,
    name: "Zone Services",
    percentage: "15%",
    features: ["Restauration et détente", "Networking lounge", "Infirmerie et sécurité", "Informations et accueil"],
    color: "earth",
  },
];

export function ZonesSection() {
  return (
    <section className="py-24 bg-foreground text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            Village <span className="text-accent">FIAA 2026</span>
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            Agbélouvé - Un espace de 4 zones thématiques conçues pour maximiser les rencontres et les opportunités.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {zones.map((zone, index) => (
            <motion.div
              key={zone.name}
              initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative group"
            >
              <div className="bg-primary-foreground/5 backdrop-blur-sm border border-primary-foreground/10 rounded-2xl p-6 hover:bg-primary-foreground/10 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center shrink-0">
                    <zone.icon className="w-7 h-7 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-display text-xl font-semibold">{zone.name}</h3>
                      <span className="text-sm font-bold text-accent">{zone.percentage}</span>
                    </div>
                    <ul className="space-y-2">
                      {zone.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm text-primary-foreground/70">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
