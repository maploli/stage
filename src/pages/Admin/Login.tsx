import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Layout } from "@/components/layout/Layout";
import { supabase } from "@/lib/supabaseClient";

const Login = () => {
    const [username, setUsername] = useState(""); // Note: Supabase uses email
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: username, // Assuming username is email or needs to be email
                password: password,
            });

            if (error) throw error;

            if (data.session) {
                toast.success('Connexion réussie');
                navigate('/admin/dashboard');
            }
        } catch (error: any) {
            toast.error(error.message || 'Identifiants incorrects');
        }
    };

    return (
        <Layout>
            <div className="container mx-auto flex items-center justify-center min-h-[60vh] px-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle>Administration FIAA</CardTitle>
                        <CardDescription>Connectez-vous pour accéder au tableau de bord</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <Input
                                    placeholder="Nom d'utilisateur"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <Input
                                    type="password"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <Button type="submit" className="w-full">Se connecter</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Login;
