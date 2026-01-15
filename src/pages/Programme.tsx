import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sun, Coffee, Moon, MapPin, Clock, Users } from "lucide-react";

const programData = {
  jour1: {
    title: "Jour 1 - Ouverture",
    date: "Cérémonie d'ouverture et découverte",
    events: [
      {
        time: "08:00 - 09:00",
        title: "Accueil et enregistrement",
        description: "Récupération des badges et kits participants",
        type: "accueil",
        location: "Entrée principale",
      },
      {
        time: "09:00 - 11:00",
        title: "Cérémonie d'ouverture officielle",
        description: "Discours officiels, présentation de la vision FIAA 2026",
        type: "ceremony",
        location: "Scène principale",
      },
      {
        time: "11:00 - 13:00",
        title: "Keynotes d'ouverture",
        description: "Interventions des leaders de l'innovation agricole africaine",
        type: "conference",
        location: "Amphithéâtre",
      },
      {
        time: "13:00 - 14:00",
        title: "Pause déjeuner networking",
        description: "Restauration et premiers échanges informels",
        type: "break",
        location: "Zone restauration",
      },
      {
        time: "14:00 - 18:00",
        title: "Village Innovation - Visites des stands",
        description: "Découverte des 30 startups exposantes et démonstrations",
        type: "exhibition",
        location: "Zone Innovation",
      },
      {
        time: "19:00 - 21:00",
        title: "Cocktail networking institutionnel",
        description: "Soirée de réseautage avec partenaires et sponsors",
        type: "networking",
        location: "Lounge VIP",
      },
    ],
  },
  jour2: {
    title: "Jour 2 - Innovation",
    date: "Ateliers et sessions B2B",
    events: [
      {
        time: "09:00 - 11:00",
        title: "Ateliers techniques - Session 1",
        description: "Agriculture de précision, IoT et drones",
        type: "workshop",
        location: "Salles de formation 1-3",
      },
      {
        time: "11:00 - 13:00",
        title: "Ateliers techniques - Session 2",
        description: "Fintech agricole et solutions de paiement",
        type: "workshop",
        location: "Salles de formation 1-3",
      },
      {
        time: "13:00 - 14:00",
        title: "Pause déjeuner",
        description: "Restauration et networking",
        type: "break",
        location: "Zone restauration",
      },
      {
        time: "14:00 - 16:00",
        title: "Sessions B2B - Rendez-vous d'affaires",
        description: "Matchmaking startups-investisseurs et partenaires",
        type: "b2b",
        location: "Espace B2B",
      },
      {
        time: "16:00 - 18:00",
        title: "Tables rondes thématiques",
        description: "Défis et opportunités de l'agritech en Afrique de l'Ouest",
        type: "conference",
        location: "Amphithéâtre",
      },
      {
        time: "19:00 - 21:00",
        title: "Pitch Contest Startups",
        description: "Compétition des meilleures startups agritech",
        type: "contest",
        location: "Scène principale",
      },
    ],
  },
  jour3: {
    title: "Jour 3 - Clôture",
    date: "Démonstrations et remise des prix",
    events: [
      {
        time: "09:00 - 12:00",
        title: "Démonstrations en conditions réelles",
        description: "Tests pratiques des solutions sur le terrain",
        type: "demo",
        location: "Zone démonstration",
      },
      {
        time: "12:00 - 13:00",
        title: "Pause déjeuner",
        description: "Derniers échanges et networking",
        type: "break",
        location: "Zone restauration",
      },
      {
        time: "14:00 - 16:00",
        title: "Annonces partenariats stratégiques",
        description: "Signatures officielles et annonces de collaborations",
        type: "ceremony",
        location: "Scène principale",
      },
      {
        time: "16:00 - 17:30",
        title: "Bilan et perspectives",
        description: "Synthèse des 3 jours et vision pour FIAA 2027",
        type: "conference",
        location: "Amphithéâtre",
      },
      {
        time: "17:30 - 18:00",
        title: "Cérémonie de clôture",
        description: "Discours de clôture officielle",
        type: "ceremony",
        location: "Scène principale",
      },
      {
        time: "19:00 - 21:00",
        title: "Cérémonie de remise des prix",
        description: "Prix du meilleur pitch, innovation de l'année, impact social",
        type: "awards",
        location: "Scène principale",
      },
    ],
  },
};

const typeColors = {
  accueil: "bg-muted text-muted-foreground",
  ceremony: "bg-accent/10 text-accent",
  conference: "bg-primary/10 text-primary",
  break: "bg-secondary text-secondary-foreground",
  exhibition: "bg-blue-500/10 text-blue-600",
  networking: "bg-purple-500/10 text-purple-600",
  workshop: "bg-emerald-500/10 text-emerald-600",
  b2b: "bg-gold/10 text-gold-dark",
  contest: "bg-orange-500/10 text-orange-600",
  demo: "bg-teal-500/10 text-teal-600",
  awards: "bg-yellow-500/10 text-yellow-600",
};

const Programme = () => {
  return (
    <Layout>
      {/* Header */}
      <section className="pt-12 pb-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <Badge variant="gold" className="mb-4">Programme FIAA 2026</Badge>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
              3 jours d'innovation intensive
            </h1>
            <p className="text-lg text-muted-foreground">
              Découvrez le programme complet avec les conférences, ateliers, sessions de networking et moments forts du festival.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Program Tabs */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="jour1" className="space-y-8">
            <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 h-auto p-1">
              <TabsTrigger value="jour1" className="py-3">
                <div className="flex flex-col items-center gap-1">
                  <Sun className="w-4 h-4" />
                  <span className="font-medium">Jour 1</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="jour2" className="py-3">
                <div className="flex flex-col items-center gap-1">
                  <Coffee className="w-4 h-4" />
                  <span className="font-medium">Jour 2</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="jour3" className="py-3">
                <div className="flex flex-col items-center gap-1">
                  <Moon className="w-4 h-4" />
                  <span className="font-medium">Jour 3</span>
                </div>
              </TabsTrigger>
            </TabsList>

            {Object.entries(programData).map(([key, day]) => (
              <TabsContent key={key} value={key}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-8">
                    <h2 className="font-display text-2xl font-bold text-foreground">{day.title}</h2>
                    <p className="text-muted-foreground">{day.date}</p>
                  </div>

                  <div className="space-y-4">
                    {day.events.map((event, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card variant="interactive">
                          <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row md:items-start gap-4">
                              <div className="flex items-center gap-3 md:w-48 shrink-0">
                                <Clock className="w-4 h-4 text-accent" />
                                <span className="font-medium text-foreground">{event.time}</span>
                              </div>
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <h3 className="font-semibold text-foreground">{event.title}</h3>
                                  <span className={`text-xs px-2 py-1 rounded-full ${typeColors[event.type as keyof typeof typeColors]}`}>
                                    {event.type}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <MapPin className="w-3 h-3" />
                                  {event.location}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Programme;
