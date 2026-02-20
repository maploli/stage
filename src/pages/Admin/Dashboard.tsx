import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { LogOut, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/lib/supabaseClient";
import { generateBadgePDF, generateBadgeBlob } from "@/utils/badgeGenerator";
import { sendApprovalEmail } from "@/lib/notificationService";

interface InscriptionData {
  id: string; // UUID
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profile: string;
  organisation: string;
  region?: string;
  fonction?: string;
  besoins?: string;
  created_at: string;
  status: string;
  badge_id: string;
  specific_data: any;
  email_sent?: boolean;
  email_sent_at?: string;
}

interface MessageData {
  id: string; // UUID
  nom: string;
  email: string;
  sujet: string;
  message: string;
  created_at: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [inscriptions, setInscriptions] = useState<InscriptionData[]>([]);
    const [messages, setMessages] = useState<MessageData[]>([]);

    useEffect(() => {
        checkUser();
        fetchData();
    }, []);

    const checkUser = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            navigate('/admin');
        }
    };

    const fetchData = async () => {
        try {
            const [inscriptionsRes, messagesRes] = await Promise.all([
                supabase.from('inscriptions').select('*').order('created_at', { ascending: false }),
                supabase.from('contacts').select('*').order('created_at', { ascending: false })
            ]);

            if (inscriptionsRes.data) setInscriptions(inscriptionsRes.data as any);
            if (messagesRes.data) setMessages(messagesRes.data as any);
        } catch (error) {
            toast.error("Erreur de chargement des données");
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin');
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            // 1. Update status in database
            const { error: updateError } = await supabase
                .from('inscriptions')
                .update({ status })
                .eq('id', id);

            if (updateError) throw updateError;
            
            toast.success(`Statut mis à jour : ${status}`);

            // 2. If status is APPROVED, send the email
            if (status === 'APPROVED') {
                const inscription = inscriptions.find(i => i.id === id);
                if (inscription && !inscription.email_sent) {
                    const emailId = toast.loading("Génération du badge et envoi du mail...");
                    
                    try {
                        const blob = await generateBadgeBlob(inscription);
                        await sendApprovalEmail(inscription, blob);
                        
                        // Update email status in DB
                        await supabase
                            .from('inscriptions')
                            .update({ 
                                email_sent: true, 
                                email_sent_at: new Date().toISOString() 
                            })
                            .eq('id', id);

                        toast.success("Email envoyé avec succès !", { id: emailId });
                    } catch (emailError) {
                        console.error("Email sending failure:", emailError);
                        toast.error("Erreur d'envoi du mail (vérifiez votre clé Resend)", { id: emailId });
                    }
                }
            }

            fetchData(); // Refresh list
        } catch (error) {
            console.error("Update error:", error);
            toast.error("Erreur mise à jour statut");
        }
    };

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold">Tableau de bord Admin</h1>
                    <Button variant="outline" onClick={handleLogout}>
                        <LogOut className="w-4 h-4 mr-2" />
                        Déconnexion
                    </Button>
                </div>

                <Tabs defaultValue="inscriptions">
                    <TabsList className="mb-4">
                        <TabsTrigger value="inscriptions">Inscriptions ({inscriptions.length})</TabsTrigger>
                        <TabsTrigger value="messages">Messages ({messages.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="inscriptions">
                        <Card>
                            <CardHeader>
                                <CardTitle>Inscriptions récentes</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Profil</TableHead>
                                            <TableHead>Organisation</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {inscriptions.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>{item.prenom} {item.nom}</TableCell>
                                                <TableCell>{item.email}</TableCell>
                                                <TableCell>{item.profile}</TableCell>
                                                <TableCell>{item.organisation}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`px-2 py-1 rounded text-xs font-semibold w-fit
                                                            ${item.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                                                              item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                                                              'bg-yellow-100 text-yellow-800'}`}>
                                                            {item.status || 'PENDING'}
                                                        </span>
                                                        {item.email_sent && (
                                                            <span className="text-[10px] text-green-600 flex items-center">
                                                                ✅ Mail envoyé
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        {item.status !== 'APPROVED' && (
                                                            <Button 
                                                                variant="default" size="sm" className="bg-green-600 hover:bg-green-700 h-8"
                                                                onClick={() => updateStatus(item.id, 'APPROVED')}
                                                            >
                                                                Valider
                                                            </Button>
                                                        )}
                                                        {item.status !== 'REJECTED' && (
                                                            <Button 
                                                                variant="destructive" size="sm" className="h-8"
                                                                onClick={() => updateStatus(item.id, 'REJECTED')}
                                                            >
                                                                Refuser
                                                            </Button>
                                                        )}
                                                        {item.status === 'APPROVED' && (
                                                            <Button variant="outline" size="sm" className="h-8" onClick={() => generateBadgePDF(item)}>
                                                                Badge
                                                            </Button>
                                                        )}
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>Détails de {item.prenom} {item.nom}</DialogTitle>
                                                                    <DialogDescription>
                                                                        Informations supplémentaires du profil {item.profile}.
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="grid gap-4 py-4">
                                                                    <div className="grid grid-cols-4 items-center gap-4">
                                                                        <span className="font-bold col-span-4">Données Spécifiques :</span>
                                                                        <pre className="col-span-4 bg-muted p-2 rounded-md text-sm overflow-auto max-h-[200px]">
                                                                            {JSON.stringify(item.specific_data, null, 2)}
                                                                        </pre>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                                        <span className="font-semibold">Téléphone:</span> <span>{item.telephone}</span>
                                                                        <span className="font-semibold">Région:</span> <span>{item.region}</span>
                                                                        <span className="font-semibold">Fonction:</span> <span>{item.fonction || '-'}</span>
                                                                        <span className="font-semibold">Besoins:</span> <span className="col-span-2">{item.besoins}</span>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="messages">
                        <Card>
                            <CardHeader>
                                <CardTitle>Messages reçus</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Email</TableHead>
                                            <TableHead>Sujet</TableHead>
                                            <TableHead>Message</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {messages.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>{item.nom}</TableCell>
                                                <TableCell>{item.email}</TableCell>
                                                <TableCell>{item.sujet}</TableCell>
                                                <TableCell className="max-w-xs truncate" title={item.message}>{item.message}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </Layout>
    );
};

export default Dashboard;
