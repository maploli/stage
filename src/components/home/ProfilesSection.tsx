import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Sprout, Rocket, Building2, Users, Newspaper, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useLanguage } from "@/context/LanguageContext";

export function ProfilesSection() {
  const { t } = useLanguage();

  const profiles = [
    {
      icon: Sprout,
      title: t("profiles.agriculteur.title"),
      description: t("profiles.agriculteur.desc"),
      badge: t("profiles.agriculteur.badge"),
      benefits: t("profiles.agriculteur.title").includes("Farmer") ? ["Free Training", "Tech Kits", "Networking"] : ["Formation gratuite", "Kits technologiques", "Networking"],
      color: "emerald",
    },
    {
      icon: Rocket,
      title: t("profiles.startup.title"),
      description: t("profiles.startup.desc"),
      badge: t("profiles.startup.badge"),
      benefits: t("profiles.startup.title").includes("Startup") ? ["Exhibition Stand", "Pitch contest", "Investor access"] : ["Stand exposition", "Pitch contest", "Accès investisseurs"],
      color: "blue",
    },
    {
      icon: Building2,
      title: t("profiles.partenaire.title"),
      description: t("profiles.partenaire.desc"),
      badge: t("profiles.partenaire.badge"),
      benefits: t("profiles.partenaire.title").includes("Partner") ? ["Real-time Analytics", "Premium Branding", "Database"] : ["Analytics temps réel", "Branding premium", "Base de données"],
      color: "gold",
    },
    {
      icon: Users,
      title: t("profiles.institution.title"),
      description: t("profiles.institution.desc"),
      badge: t("profiles.institution.badge"),
      benefits: t("profiles.institution.title").includes("Institution") ? ["Speaking slot", "VIP Networking", "Visibility"] : ["Prise de parole", "Networking VIP", "Visibilité"],
      color: "purple",
    },
    {
      icon: Newspaper,
      title: t("profiles.media.title"),
      description: t("profiles.media.desc"),
      badge: t("profiles.media.badge"),
      benefits: t("profiles.media.title").includes("Media") ? ["Accreditation", "Privileged access", "Exclusive content"] : ["Accréditation", "Accès privilégié", "Contenu exclusif"],
      color: "yellow",
    },
  ];

  const colorClasses = {
    emerald: "bg-emerald-600/10 text-emerald-600 border-emerald-600/20",
    blue: "bg-blue-600/10 text-blue-600 border-blue-600/20",
    gold: "bg-accent/10 text-accent border-accent/20",
    purple: "bg-purple-600/10 text-purple-600 border-purple-600/20",
    yellow: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  };

  return (
    <section className="py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("profiles.title").split('?')[0]} <span className="text-primary">{t("profiles.title").includes('?') ? '?' : ''}</span>
          </h2>
          {/* Simple workaround for title spanning */}
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t("profiles.title").replace("tous les acteurs", "")} <span className="text-primary">{t("profiles.title").includes("tous les acteurs") ? "tous les acteurs" : ""}</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("profiles.subtitle")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, index) => (
            <motion.div
              key={profile.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card variant="interactive" className="h-full">
                <CardContent className="p-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 border ${colorClasses[profile.color as keyof typeof colorClasses]}`}>
                    <profile.icon className="w-7 h-7" />
                  </div>
                  
                  <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                    {profile.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {profile.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {profile.benefits.map((benefit) => (
                      <span
                        key={benefit}
                        className="text-xs px-2 py-1 rounded-md bg-muted text-muted-foreground"
                      >
                        {benefit}
                      </span>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <span className="text-sm font-medium text-primary">
                      {profile.badge}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button size="lg" asChild>
            <Link to="/inscription">
              {t("hero.cta.register")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
