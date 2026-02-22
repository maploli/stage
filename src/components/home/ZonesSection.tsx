import { motion } from "framer-motion";
import { Lightbulb, GraduationCap, Building, Coffee } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";

export function ZonesSection() {
  const { t } = useLanguage();

  const zones = [
    {
      icon: Lightbulb,
      name: t("zones.innovation.name"),
      percentage: "40%",
      features: [t("zones.innovation.feat1"), t("zones.innovation.feat2"), t("zones.innovation.feat3"), t("zones.innovation.feat4")],
      color: "primary",
    },
    {
      icon: GraduationCap,
      name: t("zones.formation.name"),
      percentage: "25%",
      features: [t("zones.formation.feat1"), t("zones.formation.feat2"), t("zones.formation.feat3"), t("zones.formation.feat4")],
      color: "accent",
    },
    {
      icon: Building,
      name: t("zones.institution.name"),
      percentage: "20%",
      features: [t("zones.institution.feat1"), t("zones.institution.feat2"), t("zones.institution.feat3"), t("zones.institution.feat4")],
      color: "purple",
    },
    {
      icon: Coffee,
      name: t("zones.services.name"),
      percentage: "15%",
      features: [t("zones.services.feat1"), t("zones.services.feat2"), t("zones.services.feat3"), t("zones.services.feat4")],
      color: "earth",
    },
  ];

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
            {t("zones.title").split('FIAA')[0]} <span className="text-accent">FIAA 2026</span>
          </h2>
          <p className="text-lg text-primary-foreground/70 max-w-2xl mx-auto">
            {t("zones.subtitle")}
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
