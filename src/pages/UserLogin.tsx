import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, Lock, Mail, ArrowRight } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

const UserLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('inscriptions')
                .select('*')
                .eq('email', email)
                .eq('password', password)
                .single();
            
            if (error || !data) {
                toast.error("Identifiants incorrects ou dossier introuvable.");
            } else {
                // Store user data in session storage for the session
                sessionStorage.setItem('current_user', JSON.stringify(data));
                toast.success(`Heureux de vous revoir, ${data.prenom} !`);
                navigate('/mon-espace');
            }
        } catch (err) {
            toast.error("Erreur de connexion.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="container mx-auto py-12 px-4 min-h-[70vh] flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md"
                >
                    <Card className="shadow-xl">
                        <CardHeader className="text-center">
                            <CardTitle className="text-2xl font-bold">Connexion Participant</CardTitle>
                            <CardDescription>
                                Accédez à votre espace personnel FIAA 2026
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input 
                                            id="email"
                                            type="email" 
                                            required 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="votre@email.com"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Mot de passe</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input 
                                            id="password"
                                            type="password" 
                                            required 
                                            value={password} 
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="••••••••"
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                                    Se connecter
                                </Button>
                            </form>
                            <div className="mt-6 text-center text-sm text-muted-foreground">
                                Pas encore inscrit ?{" "}
                                <Button variant="link" onClick={() => navigate('/inscription')} className="p-0 h-auto">
                                    Inscrivez-vous ici
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </Layout>
    );
};

export default UserLogin;
