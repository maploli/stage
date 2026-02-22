import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary via-emerald-dark to-foreground" />
      <div className="absolute inset-0 pattern-dots opacity-10" />
      
      {/* Decorative */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-foreground/10 rounded-full blur-3xl" />

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 text-primary-foreground text-sm mb-8">
            <Sparkles className="w-4 h-4 text-accent" />
            Places limitées à 600 participants
          </div>

          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
            Rejoignez le mouvement de l'agriculture africaine de demain
          </h2>

          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Ne manquez pas cette opportunité unique de rencontrer les acteurs clés, 
            découvrir les dernières innovations et façonner l'avenir de l'agriculture africaine.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Button variant="hero" size="xl" asChild>
              <Link to="/inscription">
                S'inscrire maintenant
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <Link to="/sponsors">Devenir partenaire</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
