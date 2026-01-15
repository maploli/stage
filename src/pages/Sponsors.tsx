import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Check, Star, Crown, Gem, Award,
  BarChart3, Users, MessageSquare, FileText, ArrowRight
} from "lucide-react";

const packages = [
  {
    name: "Platinum",
    icon: Crown,
    price: "15 000 000",
    color: "gold",
    popular: true,
    features: [
      { name: "Naming événement", included: true },
      { name: "Stand premium (20m²)", included: true },
      { name: "Dashboard analytics complet", included: true },
      { name: "Base données participants complète", included: true },
      { name: "Session plénière (20min)", included: true },
      { name: "Atelier thématique", included: true },
      { name: "Interview média", included: true },
      { name: "Matching intelligent illimité", included: true },
      { name: "Accès lounge VIP", included: true },
      { name: "Rapport personnalisé", included: true },
    ],
  },
  {
    name: "Gold",
    icon: Star,
    price: "8 000 000",
    color: "primary",
    popular: false,
    features: [
      { name: "Bannière homepage", included: true },
      { name: "Stand moyen (12m²)", included: true },
      { name: "Dashboard analytics étendu", included: true },
      { name: "Base données limitée", included: true },
      { name: "Session plénière (10min)", included: true },
      { name: "Atelier thématique", included: true },
      { name: "Interview média", included: false },
      { name: "10 rendez-vous B2B", included: true },
      { name: "Accès lounge VIP", included: true },
      { name: "Données leads agrégées", included: true },
    ],
  },
  {
    name: "Silver",
    icon: Gem,
    price: "4 000 000",
    color: "secondary",
    popular: false,
    features: [
      { name: "Logo page sponsors", included: true },
      { name: "Stand standard (6m²)", included: true },
      { name: "Dashboard analytics basic", included: true },
      { name: "Base données participants", included: false },
      { name: "Session plénière", included: false },
      { name: "Atelier thématique", included: false },
      { name: "Interview média", included: false },
      { name: "5 rendez-vous B2B", included: true },
      { name: "Accès lounge VIP", included: false },
      { name: "Certificat impact", included: true },
    ],
  },
  {
    name: "Bronze",
    icon: Award,
    price: "2 000 000",
    color: "muted",
    popular: false,
    features: [
      { name: "Logo page sponsors", included: true },
      { name: "Stand standard (6m²)", included: true },
      { name: "Dashboard analytics", included: false },
      { name: "Base données participants", included: false },
      { name: "Session plénière", included: false },
      { name: "Atelier thématique", included: false },
      { name: "Interview média", included: false },
      { name: "Rendez-vous B2B", included: false },
      { name: "Accès lounge VIP", included: false },
      { name: "Certificat impact", included: true },
    ],
  },
];

const benefits = [
  {
    icon: BarChart3,
    title: "Analytics Temps Réel",
    description: "Suivez vos KPIs en direct : visites stand, leads générés, engagement.",
  },
  {
    icon: Users,
    title: "Matching Intelligent",
    description: "Algorithme de mise en relation avec les participants correspondant à vos critères.",
  },
  {
    icon: MessageSquare,
    title: "Messagerie B2B",
    description: "Contactez directement les participants et planifiez des rendez-vous.",
  },
  {
    icon: FileText,
    title: "Rapports Personnalisés",
    description: "Bilan complet post-événement avec ROI estimé et recommandations.",
  },
];

const Sponsors = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-12 pb-16 bg-gradient-to-b from-secondary/50 to-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="gold" className="mb-4">Partenariat FIAA 2026</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Devenez Partenaire
            </h1>
            <p className="text-lg text-muted-foreground">
              Maximisez votre visibilité auprès de 600 acteurs clés de l'agriculture africaine 
              et générez des leads qualifiés avec nos packages premium.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card
                  className={`relative h-full ${
                    pkg.popular ? "border-accent shadow-gold" : ""
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge variant="gold">Populaire</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center ${
                      pkg.popular ? "bg-accent/20" : "bg-primary/10"
                    }`}>
                      <pkg.icon className={`w-7 h-7 ${pkg.popular ? "text-accent" : "text-primary"}`} />
                    </div>
                    <CardTitle className="font-display text-xl">{pkg.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-foreground">{pkg.price}</span>
                      <span className="text-muted-foreground text-sm"> FCFA</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className={`w-4 h-4 mt-0.5 shrink-0 ${
                            feature.included ? "text-primary" : "text-muted-foreground/30"
                          }`} />
                          <span className={`text-sm ${
                            feature.included ? "text-foreground" : "text-muted-foreground/50 line-through"
                          }`}>
                            {feature.name}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={pkg.popular ? "hero" : "outline"}
                      asChild
                    >
                      <Link to="/contact">
                        Nous contacter
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Avantages exclusifs sponsors
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Profitez d'outils avancés pour maximiser votre ROI pendant et après l'événement.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card variant="glass" className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <benefit.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Une question sur nos packages ?
            </h2>
            <p className="text-muted-foreground mb-8">
              Notre équipe commerciale est à votre disposition pour vous présenter 
              les différentes options et personnaliser votre partenariat.
            </p>
            <Button size="xl" variant="hero" asChild>
              <Link to="/contact">
                Contactez notre équipe
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
};

export default Sponsors;
