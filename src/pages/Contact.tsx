import { useState } from "react";
import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MapPin, Mail, Phone, Clock, Send,
  Facebook, Twitter, Linkedin, Instagram
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";

const Contact = () => {
  const [formData, setFormData] = useState({
    nom: "",
    email: "",
    sujet: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const { error } = await supabase
            .from('contacts')
            .insert([formData]);

        if (error) throw error;

        toast.success("Message envoyé avec succès ! Nous vous répondrons sous 48h.");
        setFormData({ nom: "", email: "", sujet: "", message: "" });
    } catch (error) {
        console.error("Erreur:", error);
        toast.error("Erreur lors de l'envoi du message.");
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="pt-12 pb-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <Badge variant="gold" className="mb-4">Contact</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              Contactez-nous
            </h1>
            <p className="text-lg text-muted-foreground">
              Une question sur l'événement, les inscriptions ou les partenariats ? 
              Notre équipe est à votre disposition.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2"
            >
              <Card>
                <CardContent className="p-8">
                  <h2 className="font-display text-2xl font-bold text-foreground mb-6">
                    Envoyez-nous un message
                  </h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom complet *</Label>
                        <Input
                          id="nom"
                          name="nom"
                          placeholder="Votre nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="sujet">Sujet</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez un sujet" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inscription">Inscription</SelectItem>
                          <SelectItem value="partenariat">Partenariat / Sponsoring</SelectItem>
                          <SelectItem value="presse">Demande presse</SelectItem>
                          <SelectItem value="logistique">Logistique / Hébergement</SelectItem>
                          <SelectItem value="autre">Autre question</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Votre message..."
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        required
                      />
                    </div>

                    <Button type="submit" size="lg">
                      Envoyer le message
                      <Send className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Card variant="glass">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Informations de contact
                  </h3>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Adresse</div>
                        <div className="text-sm text-muted-foreground">
                          Agbélouvé, Région Maritime<br />Togo
                        </div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Email</div>
                        <a href="mailto:contact@fiaa2026.tg" className="text-sm text-primary hover:underline">
                          contact@fiaa2026.tg
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Phone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Téléphone</div>
                        <a href="tel:+22890000000" className="text-sm text-primary hover:underline">
                          +228 90 00 00 00
                        </a>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">Horaires</div>
                        <div className="text-sm text-muted-foreground">
                          Lun - Ven : 8h - 18h<br />Sam : 9h - 13h
                        </div>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card variant="glass">
                <CardContent className="p-6">
                  <h3 className="font-display text-lg font-semibold text-foreground mb-4">
                    Suivez-nous
                  </h3>
                  <div className="flex gap-3">
                    {[
                      { icon: Facebook, href: "#" },
                      { icon: Twitter, href: "#" },
                      { icon: Linkedin, href: "#" },
                      { icon: Instagram, href: "#" },
                    ].map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                      >
                        <social.icon className="w-5 h-5" />
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
