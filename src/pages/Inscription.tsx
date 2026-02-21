import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  Sprout, Rocket, Building2, Users, Newspaper, 
  ArrowRight, ArrowLeft, CheckCircle2, User, Mail, Phone, MapPin, Lock
} from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabaseClient";
import { generateBadgePDF } from "@/utils/badgeGenerator";

type ProfileType = "agriculteur" | "startup" | "partenaire" | "visiteur" | "media" | null;

const profiles = [
  {
    id: "agriculteur" as ProfileType,
    icon: Sprout,
    title: "Agriculteur",
    description: "Accédez aux formations et technologies agricoles innovantes.",
    badge: "Badge Vert",
    color: "emerald",
  },
  {
    id: "startup" as ProfileType,
    icon: Rocket,
    title: "Startup Agritech",
    description: "Présentez vos solutions et participez au pitch contest.",
    badge: "Badge Bleu",
    color: "blue",
  },
  {
    id: "partenaire" as ProfileType,
    icon: Building2,
    title: "Partenaire / Sponsor",
    description: "Maximisez votre visibilité avec nos packages premium.",
    badge: "Badge Or",
    color: "gold",
  },
  {
    id: "visiteur" as ProfileType,
    icon: Users,
    title: "Visiteur / Invité",
    description: "Découvrez l'innovation agricole africaine.",
    badge: "Badge Standard",
    color: "purple",
  },
  {
    id: "media" as ProfileType,
    icon: Newspaper,
    title: "Média / Presse",
    description: "Couvrez l'événement avec un accès privilégié.",
    badge: "Badge Jaune",
    color: "yellow",
  },
];

const colorClasses = {
  emerald: "border-emerald-600 bg-emerald-600/10",
  blue: "border-blue-600 bg-blue-600/10",
  gold: "border-accent bg-accent/10",
  purple: "border-purple-600 bg-purple-600/10",
  yellow: "border-yellow-500 bg-yellow-500/10",
};

const Inscription = () => {
  const [step, setStep] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<ProfileType>(null);
  const [registrationId, setRegistrationId] = useState<string | null>(null); // Changed to string for UUID
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    region: "",
    organisation: "",
    fonction: "",
    besoins: "",
    superficie: "",
    production: "",
    stage: "",
    pitchDeck: "",
    password: "",
  });

  const handleProfileSelect = (profileId: ProfileType) => {
    setSelectedProfile(profileId);
    setStep(2);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('inscriptions')
        .insert([{ 
          nom: formData.nom,
          prenom: formData.prenom,
          email: formData.email,
          telephone: formData.telephone,
          region: formData.region,
          organisation: formData.organisation,
          fonction: formData.fonction,
          besoins: formData.besoins,
          profile: selectedProfile,
          password: formData.password,
          specific_data: {
            superficie: formData.superficie,
            production: formData.production,
            stage: formData.stage,
            pitchDeck: formData.pitchDeck
          }
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        setRegistrationId(data.badge_id); // Note: badge_id in snake_case if using standard Postgres
        setStep(3);
        toast.success("Inscription soumise avec succès !");
      }
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur de connexion. Veuillez vérifier votre connexion et la configuration (clés Supabase).");
    }
  };

  return (
    <Layout>
      {/* Header */}
      <section className="pt-12 pb-8 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl"
          >
            <Badge variant="gold" className="mb-4">Inscription FIAA 2026</Badge>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Rejoignez le Festival
            </h1>
            <p className="text-muted-foreground">
              Complétez votre inscription en quelques étapes simples.
            </p>
          </motion.div>

          {/* Steps */}
          <div className="flex items-center gap-4 mt-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    step >= s
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                </div>
                <span className={`text-sm hidden sm:block ${step >= s ? "text-foreground" : "text-muted-foreground"}`}>
                  {s === 1 && "Profil"}
                  {s === 2 && "Informations"}
                  {s === 3 && "Confirmation"}
                </span>
                {s < 3 && <div className="w-8 h-px bg-border hidden sm:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Step 1: Profile Selection */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="font-display text-2xl font-semibold mb-6">
                Sélectionnez votre profil
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {profiles.map((profile) => (
                  <Card
                    key={profile.id}
                    variant="interactive"
                    className={`cursor-pointer transition-all ${
                      selectedProfile === profile.id
                        ? colorClasses[profile.color as keyof typeof colorClasses]
                        : ""
                    }`}
                    onClick={() => handleProfileSelect(profile.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                          <profile.icon className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">{profile.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">{profile.description}</p>
                          <Badge variant="outline" className="text-xs">{profile.badge}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Step 2: Form */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="max-w-2xl"
            >
              <Button
                variant="ghost"
                className="mb-6"
                onClick={() => setStep(1)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>

              <Card>
                <CardHeader>
                  <CardTitle>Vos informations</CardTitle>
                  <CardDescription>
                    Profil sélectionné : {profiles.find(p => p.id === selectedProfile)?.title}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="prenom">Prénom *</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="prenom"
                            name="prenom"
                            placeholder="Votre prénom"
                            className="pl-10"
                            value={formData.prenom}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom *</Label>
                        <Input
                          id="nom"
                          name="nom"
                          placeholder="Votre nom"
                          value={formData.nom}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="votre@email.com"
                            className="pl-10"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="telephone">Téléphone *</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            id="telephone"
                            name="telephone"
                            placeholder="+228 XX XX XX XX"
                            className="pl-10"
                            value={formData.telephone}
                            onChange={handleInputChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Définissez un mot de passe pour votre espace *</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Votre mot de passe"
                                className="pl-10"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">Ce mot de passe vous permettra d'accéder à votre espace pour suivre votre dossier et télécharger votre badge.</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="region">Région</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre région" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maritime">Région Maritime</SelectItem>
                          <SelectItem value="plateaux">Région des Plateaux</SelectItem>
                          <SelectItem value="centrale">Région Centrale</SelectItem>
                          <SelectItem value="kara">Région de la Kara</SelectItem>
                          <SelectItem value="savanes">Région des Savanes</SelectItem>
                          <SelectItem value="autre">Autre pays</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organisation">Organisation / Entreprise</Label>
                      <Input
                        id="organisation"
                        name="organisation"
                        placeholder="Nom de votre organisation"
                        value={formData.organisation}
                        onChange={handleInputChange}
                      />
                    </div>

                    {/* Champs spécifiques Agriculteur */}
                    {selectedProfile === 'agriculteur' && (
                        <div className="space-y-4 border-l-4 border-emerald-500 pl-4 py-2 bg-emerald-50/50 rounded-r">
                            <h3 className="font-semibold text-emerald-800">Profil Agriculteur</h3>
                            <div className="space-y-2">
                                <Label htmlFor="superficie">Superficie (hectares)</Label>
                                <Input
                                    id="superficie"
                                    name="superficie"
                                    placeholder="Ex: 5"
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="production">Type de Production</Label>
                                <Input
                                    id="production"
                                    name="production"
                                    placeholder="Ex: Maïs, Coton, Maraîchage"
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    )}

                    {/* Champs spécifiques Startup */}
                    {selectedProfile === 'startup' && (
                        <div className="space-y-4 border-l-4 border-blue-500 pl-4 py-2 bg-blue-50/50 rounded-r">
                            <h3 className="font-semibold text-blue-800">Dossier Startup</h3>
                            <div className="space-y-2">
                                <Label htmlFor="stage">Stade de développement</Label>
                                <Select onValueChange={(val) => setFormData({...formData, stage: val} as any)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionnez..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="idea">Idée / Concept</SelectItem>
                                        <SelectItem value="mvp">Prototype (MVP)</SelectItem>
                                        <SelectItem value="growth">Croissance / Commercialisation</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="pitchDeck">Lien Pitch Deck / Démo</Label>
                                <Input
                                    id="pitchDeck"
                                    name="pitchDeck"
                                    placeholder="https://..."
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                      <Label htmlFor="besoins">Vos attentes / besoins</Label>
                      <Textarea
                        id="besoins"
                        name="besoins"
                        placeholder="Décrivez brièvement vos attentes pour cet événement..."
                        value={formData.besoins}
                        onChange={handleInputChange}
                        rows={4}
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Soumettre mon inscription
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-lg mx-auto text-center"
            >
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="font-display text-3xl font-bold text-foreground mb-4">
                Inscription soumise !
              </h2>
              <p className="text-muted-foreground mb-8">
                Merci {formData.prenom} ! Votre demande d'inscription a été enregistrée. 
                Vous pouvez télécharger votre badge provisoire ci-dessous.
              </p>
              
              {registrationId && (
                <div className="mb-6">
                    <Button 
                        size="lg" 
                        variant="default"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => generateBadgePDF({
                            prenom: formData.prenom,
                            nom: formData.nom,
                            profile: selectedProfile,
                            organisation: formData.organisation,
                            fonction: formData.fonction,
                            region: formData.region,
                            badge_id: registrationId,
                            status: 'APPROVED' // Provisoirement approuvé pour le badge
                        })}
                    >
                        Télécharger mon Badge
                    </Button>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link to="/">Retour à l'accueil</Link>
                </Button>
                <Button variant="ghost" asChild>
                  <Link to="/programme">Découvrir le programme</Link>
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Inscription;
