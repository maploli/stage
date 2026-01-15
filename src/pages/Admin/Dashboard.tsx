import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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

interface InscriptionData {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profile: string;
  organisation: string;
  region?: string;
  fonction?: string;
  besoins?: string;
  createdAt: string;
  status: string;
  badgeId: string;
  specificData: any;
}

interface MessageData {
  id: number;
  nom: string;
  email: string;
  sujet: string;
  message: string;
  createdAt: string;
}

const Dashboard = () => {
    const navigate = useNavigate();
    const [inscriptions, setInscriptions] = useState<InscriptionData[]>([]);
    const [messages, setMessages] = useState<MessageData[]>([]);

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin');
            return;
        }

        fetchData();
    }, [navigate]);

    const fetchData = async () => {
        try {
            const [inscriptionsRes, messagesRes] = await Promise.all([
                fetch(`${import.meta.env.VITE_API_URL}/inscriptions`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                }),
                fetch(`${import.meta.env.VITE_API_URL}/messages`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
                })
            ]);

            if (inscriptionsRes.ok) setInscriptions(await inscriptionsRes.json());
            if (messagesRes.ok) setMessages(await messagesRes.json());
        } catch (error) {
            toast.error("Erreur de chargement des données");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin');
    };

    const updateStatus = async (id: number, status: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/inscriptions/${id}/status`, {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                },
                body: JSON.stringify({ status })
            });
            if (res.ok) {
                toast.success(`Statut mis à jour : ${status}`);
                fetchData(); // Refresh list
            } else {
                toast.error("Erreur mise à jour statut");
            }
        } catch (error) {
            toast.error("Erreur serveur");
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
                                                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                                <TableCell>{item.prenom} {item.nom}</TableCell>
                                                <TableCell>{item.email}</TableCell>
                                                <TableCell>{item.profile}</TableCell>
                                                <TableCell>{item.organisation}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded text-xs font-semibold
                                                        ${item.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                                                          item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                                                          'bg-yellow-100 text-yellow-800'}`}>
                                                        {item.status || 'PENDING'}
                                                    </span>
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
                                                            <Button variant="outline" size="sm" className="h-8" onClick={() => window.open(`${import.meta.env.VITE_API_URL}/badges/${item.badgeId}`, '_blank')}>
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
                                                                            {JSON.stringify(item.specificData, null, 2)}
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
                                                <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
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
