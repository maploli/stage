import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Download, Loader2, CheckCircle2, XCircle, 
    User, Briefcase, MapPin, ExternalLink, MessageSquare, 
    LogOut, LayoutDashboard, FileText
} from "lucide-react";
import { generateBadgePDF } from "@/utils/badgeGenerator";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

const MySpace = () => {
    const navigate = useNavigate();
    const [participant, setParticipant] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            const userJson = sessionStorage.getItem('current_user');
            if (!userJson) {
                navigate('/login');
                setLoading(false);
                return;
            }

            const localUser = JSON.parse(userJson);
            
            try {
                // Fetch fresh data from Supabase to catch admin updates
                const { data, error } = await supabase
                    .from('inscriptions')
                    .select('*')
                    .eq('id', localUser.id)
                    .single();

                if (data && !error) {
                    setParticipant(data);
                    // Update session storage with fresh data
                    sessionStorage.setItem('current_user', JSON.stringify(data));
                } else {
                    // Fallback to local data if fetch fails
                    setParticipant(localUser);
                }
            } catch (err) {
                console.error("Error refreshing user data:", err);
                setParticipant(localUser);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [navigate]);

    const handleLogout = () => {
        sessionStorage.removeItem('current_user');
        toast.info("Déconnecté avec succès");
        navigate('/login');
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin w-8 h-8 text-primary" />
            </div>
        );
    }

    if (!participant) return null;

    const isApproved = participant.status === 'APPROVED';

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-foreground">
                            Bienvenue, {participant.prenom}
                        </h1>
                        <p className="text-muted-foreground">
                            {participant.organisation} — Profil {participant.profile}
                        </p>
                    </div>
                    <Button variant="outline" onClick={handleLogout} className="text-destructive hover:bg-destructive/10">
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Sidebar / Info Card */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card className="overflow-hidden">
                            <div className={`h-2 w-full ${
                                participant.status === 'APPROVED' ? 'bg-green-500' : 
                                participant.status === 'REJECTED' ? 'bg-red-500' : 
                                'bg-yellow-500'
                            }`} />
                            <CardHeader>
                                <CardTitle className="text-lg">Statut du dossier</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className={`flex items-center gap-3 p-3 rounded-lg border
                                    ${participant.status === 'APPROVED' ? 'bg-green-50 border-green-100 text-green-800' : 
                                      participant.status === 'REJECTED' ? 'bg-red-50 border-red-100 text-red-800' : 
                                      'bg-yellow-50 border-yellow-100 text-yellow-800'}`}>
                                    
                                    {participant.status === 'APPROVED' && <CheckCircle2 className="w-5 h-5"/>}
                                    {participant.status === 'REJECTED' && <XCircle className="w-5 h-5"/>}
                                    {(participant.status === 'PENDING' || !participant.status) && <Loader2 className="w-5 h-5 animate-spin"/>}
                                    
                                    <span className="font-bold">
                                        {participant.status === 'APPROVED' ? 'Validé' : 
                                         participant.status === 'REJECTED' ? 'Refusé' : 
                                         'En cours d\'examen'}
                                    </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {participant.status === 'APPROVED' 
                                        ? "Votre inscription est validée ! Vous pouvez maintenant télécharger votre badge officiel." 
                                        : participant.status === 'REJECTED'
                                        ? "Désolé, votre demande n'a pas été retenue. Contactez-nous pour plus de détails."
                                        : "Notre équipe analyse votre dossier. Vous recevrez un email dès que possible."}
                                </p>
                                
                                {isApproved && (
                                    <Button 
                                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => generateBadgePDF(participant)}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Télécharger le Badge
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Besoin d'aide ?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    Une question sur votre participation ? Notre équipe est là pour vous accompagner.
                                </p>
                                <Button variant="secondary" className="w-full" asChild>
                                    <Link to="/contact">
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        Nous contacter
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Main Content Areas */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="overview" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-6">
                                <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                                <TabsTrigger value="profile">Mon Profil</TabsTrigger>
                                <TabsTrigger value="activities">Activités</TabsTrigger>
                            </TabsList>

                            <TabsContent value="overview">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Résumé de votre participation</CardTitle>
                                        </CardHeader>
                                        <CardContent className="grid gap-4 sm:grid-cols-2">
                                            <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-xl">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <LayoutDashboard className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Profil</p>
                                                    <p className="font-bold capitalize">{participant.profile}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-secondary/20 rounded-xl">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Région</p>
                                                    <p className="font-bold">{participant.region || 'Non précisé'}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Profile Specific Content */}
                                    {participant.profile === 'startup' && (
                                        <Card className="border-blue-200 bg-blue-50/30">
                                            <CardHeader>
                                                <CardTitle className="text-blue-900 flex items-center gap-2">
                                                    <Briefcase className="w-5 h-5" />
                                                    Espace Startup
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="p-4 bg-white rounded-lg border border-blue-100 shadow-sm">
                                                    <p className="text-sm font-semibold text-blue-800 mb-2">Statut Pitch Deck :</p>
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm">{participant.specific_data?.pitchDeck ? "✅ Document reçu" : "❌ Non fourni"}</span>
                                                        {participant.specific_data?.pitchDeck && (
                                                            <Button size="sm" variant="outline" asChild>
                                                                <a href={participant.specific_data.pitchDeck} target="_blank" rel="noopener noreferrer">
                                                                    Voir le lien <ExternalLink className="ml-2 w-3 h-3"/>
                                                                </a>
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {participant.profile === 'agriculteur' && (
                                        <Card className="border-emerald-200 bg-emerald-50/30">
                                            <CardHeader>
                                                <CardTitle className="text-emerald-900 flex items-center gap-2">
                                                    <Briefcase className="w-5 h-5" />
                                                    Espace Agriculteur
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid sm:grid-cols-2 gap-4">
                                                    <div className="p-4 bg-white rounded-lg border border-emerald-100 shadow-sm">
                                                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Superficie</p>
                                                        <p className="text-lg font-bold text-emerald-800">{participant.specific_data?.superficie || '0'} ha</p>
                                                    </div>
                                                    <div className="p-4 bg-white rounded-lg border border-emerald-100 shadow-sm">
                                                        <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Production</p>
                                                        <p className="text-lg font-bold text-emerald-800">{participant.specific_data?.production || 'Non renseigné'}</p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}

                                    {participant.profile === 'partenaire' && (
                                        <Card className="border-amber-200 bg-amber-50/30">
                                            <CardHeader>
                                                <CardTitle className="text-amber-900 flex items-center gap-2">
                                                    <Briefcase className="w-5 h-5" />
                                                    Espace Sponsor
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-4">
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="p-3 bg-white rounded-lg border border-amber-100 text-center shadow-sm">
                                                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Vues Stand</p>
                                                        <p className="text-lg font-bold text-amber-800">124</p>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-lg border border-amber-100 text-center shadow-sm">
                                                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Leads</p>
                                                        <p className="text-lg font-bold text-amber-800">42</p>
                                                    </div>
                                                    <div className="p-3 bg-white rounded-lg border border-amber-100 text-center shadow-sm">
                                                        <p className="text-[10px] text-muted-foreground uppercase font-bold">Scans</p>
                                                        <p className="text-lg font-bold text-amber-800">18</p>
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-center text-muted-foreground italic">* Données simulées pour la démo</p>
                                            </CardContent>
                                        </Card>
                                    )}
                                </motion.div>
                            </TabsContent>

                            <TabsContent value="profile">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Détails du compte</CardTitle>
                                        <CardDescription>Consultez vos informations enregistrées au FIAA 2026.</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <div className="grid gap-6 sm:grid-cols-2">
                                            <div className="space-y-1">
                                                <Label className="text-muted-foreground">Nom complet</Label>
                                                <p className="font-semibold text-lg">{participant.prenom} {participant.nom}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-muted-foreground">Email</Label>
                                                <p className="font-semibold text-lg">{participant.email}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-muted-foreground">Téléphone</Label>
                                                <p className="font-semibold text-lg">{participant.telephone}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <Label className="text-muted-foreground">Organisation</Label>
                                                <p className="font-semibold text-lg">{participant.organisation}</p>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t">
                                            <Label className="text-muted-foreground">Vos attentes / besoins</Label>
                                            <p className="mt-2 p-4 bg-muted/30 rounded-lg text-sm italic italic">
                                                "{participant.besoins || "Aucune attente spécifique mentionnée."}"
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="activities">
                                <Card>
                                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                                            <FileText className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-foreground">Aucune activité récente</h3>
                                        <p className="text-muted-foreground max-w-xs mx-auto">
                                            Une fois validé, vous trouverez ici le programme personnalisé et les opportunités de réseautage.
                                        </p>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default MySpace;
