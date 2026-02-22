import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Lock, Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const UserLogin = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [resetLoading, setResetLoading] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('inscriptions')
                .select('*')
                .eq('email', formData.email)
                .eq('password', formData.password)
                .single();

            if (error || !data) {
                throw new Error("Identifiants incorrects ou compte inexistant.");
            }

            sessionStorage.setItem('current_user', JSON.stringify(data));
            toast.success("Connexion réussie !");
            navigate('/mon-espace');
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la connexion.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setResetLoading(true);
        const toastId = toast.loading("Vérification de l'adresse email...");

        try {
            const { data, error } = await supabase
                .from('inscriptions')
                .select('email, password, prenom')
                .eq('email', resetEmail)
                .single();

            if (error || !data) {
                throw new Error("Aucun compte trouvé avec cet email.");
            }

            // In a real app, we'd send a reset link. 
            // For this project, we send the password back to the user's email.
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    inscription: { email: data.email, prenom: data.prenom, password: data.password },
                    type: 'PASSWORD_RECOVERY'
                })
            });

            if (!response.ok) throw new Error("Erreur service email");

            toast.success("Un email contenant vos identifiants vous a été envoyé.", { id: toastId });
            setResetEmail("");
        } catch (error: any) {
            toast.error(error.message || "Erreur lors de la récupération.", { id: toastId });
        } finally {
            setResetLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <Card className="border-2">
                        <CardHeader className="space-y-1">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Lock className="w-8 h-8 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-2xl font-bold text-center">{t("auth.login.title")}</CardTitle>
                            <CardDescription className="text-center">
                                {t("auth.login.desc")}
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={handleLogin}>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">{t("auth.login.email")}</Label>
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
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">{t("auth.login.password")}</Label>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <button type="button" className="text-xs text-primary hover:underline">
                                                    {t("auth.login.forgot")}
                                                </button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Récupérer mon accès</DialogTitle>
                                                    <DialogDescription>
                                                        Saisissez votre email. Nous vous renverrons vos identifiants de connexion.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleForgotPassword} className="space-y-4 pt-4">
                                                    <div className="space-y-2">
                                                        <Label htmlFor="reset-email">Votre Email</Label>
                                                        <Input 
                                                            id="reset-email" 
                                                            type="email" 
                                                            placeholder="votre@email.com" 
                                                            value={resetEmail}
                                                            onChange={(e) => setResetEmail(e.target.value)}
                                                            required 
                                                        />
                                                    </div>
                                                    <Button type="submit" className="w-full" disabled={resetLoading}>
                                                        {resetLoading ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : "M'envoyer mes identifiants"}
                                                    </Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <Input 
                                            id="password" 
                                            name="password"
                                            type="password" 
                                            className="pl-10"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            required 
                                        />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col space-y-4">
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? (
                                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                    ) : (
                                        <>
                                            {t("auth.login.submit")}
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </>
                                    )}
                                </Button>
                                <div className="text-sm text-center text-muted-foreground">
                                    {t("auth.login.noAccount")}{" "}
                                    <Link to="/inscription" className="text-primary font-semibold hover:underline">
                                        {t("auth.login.register")}
                                    </Link>
                                </div>
                                <Button variant="ghost" className="w-full" asChild>
                                    <Link to="/">
                                        <ArrowLeft className="mr-2 w-4 h-4" />
                                        {t("common.back")}
                                    </Link>
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </motion.div>
            </div>
        </Layout>
    );
};

export default UserLogin;
