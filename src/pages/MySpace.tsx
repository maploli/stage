import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Download, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { generateBadgePDF } from "@/utils/badgeGenerator";
import { motion } from "framer-motion";

const MySpace = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [participant, setParticipant] = useState<any>(null);

    const handleCheckStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inscriptions')
                .select('*')
                .eq('email', email)
                .single();
            
            if (error) {
                toast.error("Aucune inscription trouvée avec cet email.");
                setParticipant(null);
            } else {
                setParticipant(data);
                toast.success("Dossier trouvé !");
            }
        } catch (err) {
            toast.error("Erreur de connexion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto py-12 px-4 min-h-[60vh]">
                <h1 className="font-display text-3xl font-bold mb-8 text-center">Mon Espace Participant</h1>

                {!participant ? (
                    <Card className="max-w-md mx-auto">
                        <CardHeader>
                            <CardTitle>Suivi de dossier</CardTitle>
                            <CardDescription>Entrez votre email pour vérifier le statut de votre inscription.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCheckStatus} className="space-y-4">
                                <div className="space-y-2">
                                    <Label>Email utilisé lors de l'inscription</Label>
                                    <Input 
                                        type="email" 
                                        required 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="votre@email.com"
                                    />
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                                    Vérifier mon statut
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-2xl">{participant.prenom} {participant.nom}</CardTitle>
                                    <CardDescription>{participant.profile} - {participant.organisation}</CardDescription>
                                </div>
                                <Button variant="ghost" onClick={() => setParticipant(null)}>Déconnexion</Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            
                            <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-lg">
                                <div className="font-semibold w-1/3">Statut du dossier :</div>
                                <div className="flex-1">
                                    <span className={`px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 w-fit
                                        ${participant.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                                          participant.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                                          'bg-yellow-100 text-yellow-800'}`}>
                                        
                                        {participant.status === 'APPROVED' && <CheckCircle2 className="w-4 h-4"/>}
                                        {participant.status === 'REJECTED' && <XCircle className="w-4 h-4"/>}
                                        {participant.status === 'PENDING' && <Loader2 className="w-4 h-4"/>}
                                        {participant.status || 'PENDING'}
                                    </span>
                                </div>
                            </div>

                            {participant.status === 'APPROVED' ? (
                                <div className="text-center py-6">
                                    <p className="mb-4 text-green-700 font-medium">
                                        Félicitations ! Votre inscription est validée.
                                    </p>
                                    <Button 
                                        size="lg" 
                                        className="bg-emerald-600 hover:bg-emerald-700"
                                        onClick={() => generateBadgePDF(participant)}
                                    >
                                        <Download className="mr-2 h-4 w-4" />
                                        Télécharger mon Badge Officiel
                                    </Button>
                                </div>
                            ) : participant.status === 'REJECTED' ? (
                                <div className="text-center py-6 text-muted-foreground">
                                    Votre dossier n'a malheureusement pas été retenu. Veuillez nous contacter pour plus d'informations.
                                </div>
                            ) : (
                                <div className="text-center py-6 text-muted-foreground">
                                    Votre dossier est en cours d'examen par notre comité. Vous recevrez une notification par email dès qu'une décision sera prise.
                                </div>
                            )}

                        </CardContent>
                    </Card>
                )}
            </div>
        </Layout>
    );
};

export default MySpace;
