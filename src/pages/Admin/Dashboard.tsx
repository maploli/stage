import { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { LogOut, Eye, BarChart3, Users, Mail, CheckCircle2, XCircle, Camera, Loader2, Trash2 } from "lucide-react";
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
import { sendApprovalEmail, sendRejectionEmail } from "@/lib/notificationService";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';

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

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#6366f1'];

const Dashboard = () => {
    const navigate = useNavigate();
    const [inscriptions, setInscriptions] = useState<InscriptionData[]>([]);
    const [messages, setMessages] = useState<MessageData[]>([]);
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);

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

            if (inscriptionsRes.data) setInscriptions(inscriptionsRes.data as InscriptionData[]);
            if (messagesRes.data) setMessages(messagesRes.data as MessageData[]);
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
            const { error: updateError } = await supabase
                .from('inscriptions')
                .update({ status })
                .eq('id', id);

            if (updateError) throw updateError;
            
            if (status === 'APPROVED') {
                const inscription = inscriptions.find(i => i.id === id);
                if (inscription && !inscription.email_sent) {
                    try {
                        const blob = await generateBadgeBlob(inscription);
                        await sendApprovalEmail(inscription, blob);
                        await supabase.from('inscriptions').update({ email_sent: true, email_sent_at: new Date().toISOString() }).eq('id', id);
                    } catch (e) { 
                        console.error("Email sending failure:", e);
                        toast.error("Erreur d'envoi du mail de validation");
                    }
                }
            } else if (status === 'REJECTED') {
                const inscription = inscriptions.find(i => i.id === id);
                if (inscription) {
                    try { 
                        await sendRejectionEmail(inscription); 
                    } catch(e) {
                        console.error("Rejection email failure:", e);
                    }
                }
            }

            toast.success(`Statut mis à jour : ${status}`);
            fetchData();
        } catch (error) {
            toast.error("Erreur mise à jour statut");
        }
    };

    const handleBulkAction = async (status: string) => {
        if (selectedIds.length === 0) return;
        setIsProcessing(true);
        const toastId = toast.loading(`Traitement de ${selectedIds.length} inscriptions...`);

        try {
            const { error } = await supabase
                .from('inscriptions')
                .update({ status })
                .in('id', selectedIds);

            if (error) throw error;

            toast.success(`${selectedIds.length} inscriptions ${status === 'APPROVED' ? 'approuvées' : 'refusées'}.`, { id: toastId });
            setSelectedIds([]);
            fetchData();
        } catch (error) {
            toast.error("Erreur lors de l'action groupée", { id: toastId });
        } finally {
            setIsProcessing(false);
        }
    };

    const handleResendEmail = async (inscription: InscriptionData) => {
        const emailId = toast.loading(`Renvoi du mail à ${inscription.email}...`);
        try {
            const blob = await generateBadgeBlob(inscription);
            await sendApprovalEmail(inscription, blob);
            await supabase.from('inscriptions').update({ email_sent: true, email_sent_at: new Date().toISOString() }).eq('id', inscription.id);
            toast.success("Badge renvoyé avec succès !", { id: emailId });
            fetchData();
        } catch (error) {
            toast.error("Erreur lors du renvoi du mail.", { id: emailId });
        }
    };

    // Stats calculations
    const stats = useMemo(() => {
        const profileCount: Record<string, number> = {};
        const statusCount: Record<string, number> = {};
        const regionCount: Record<string, number> = {};
        
        inscriptions.forEach(ins => {
            profileCount[ins.profile] = (profileCount[ins.profile] || 0) + 1;
            statusCount[ins.status] = (statusCount[ins.status] || 0) + 1;
            if (ins.region) regionCount[ins.region] = (regionCount[ins.region] || 0) + 1;
        });

        const profileData = Object.entries(profileCount).map(([name, value]) => ({ name, value }));
        const statusData = Object.entries(statusCount).map(([name, value]) => ({ name, value }));
        const regionData = Object.entries(regionCount).map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value).slice(0, 5);

        return { profileData, statusData, regionData };
    }, [inscriptions]);

    return (
        <Layout>
            <div className="container mx-auto py-8 px-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Administration FIAA 2026</h1>
                        <p className="text-muted-foreground">Gestion des inscriptions et contrôle d'accès.</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link to="/admin/scan">
                                <Camera className="w-4 h-4 mr-2" />
                                Scanner Badge
                            </Link>
                        </Button>
                        <Button variant="destructive" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Déconnexion
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Users className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Total Inscriptions</p>
                                    <p className="text-2xl font-bold">{inscriptions.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Approuvées</p>
                                    <p className="text-2xl font-bold text-green-600">
                                        {inscriptions.filter(i => i.status === 'APPROVED').length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Loader2 className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">En attente</p>
                                    <p className="text-2xl font-bold text-yellow-600">
                                        {inscriptions.filter(i => i.status === 'PENDING' || !i.status).length}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Mail className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Messages reçus</p>
                                    <p className="text-2xl font-bold text-blue-600">{messages.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="inscriptions">
                    <TabsList className="mb-6 h-12">
                        <TabsTrigger value="inscriptions" className="px-6">Inscriptions</TabsTrigger>
                        <TabsTrigger value="stats" className="px-6">Statistiques</TabsTrigger>
                        <TabsTrigger value="messages" className="px-6">Messages</TabsTrigger>
                    </TabsList>

                    <TabsContent value="inscriptions">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                                {selectedIds.length > 0 && (
                                    <div className="flex items-center gap-2 animate-in slide-in-from-left-4">
                                        <span className="text-sm font-medium mr-2">{selectedIds.length} sélectionné(s) :</span>
                                        <Button size="sm" onClick={() => handleBulkAction('APPROVED')} disabled={isProcessing}>
                                            <CheckCircle2 className="w-4 h-4 mr-2" /> Approuver
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleBulkAction('REJECTED')} disabled={isProcessing}>
                                            <XCircle className="w-4 h-4 mr-2" /> Refuser
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => setSelectedIds([])}>Annuler</Button>
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground italic">Dernières inscriptions en haut</p>
                        </div>

                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-10">
                                                <Checkbox 
                                                    checked={selectedIds.length === inscriptions.length && inscriptions.length > 0}
                                                    onCheckedChange={(checked) => {
                                                        setSelectedIds(checked ? inscriptions.map(i => i.id) : []);
                                                    }}
                                                />
                                            </TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Nom</TableHead>
                                            <TableHead>Profil</TableHead>
                                            <TableHead>Organisation</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {inscriptions.map((item) => (
                                            <TableRow key={item.id} className={selectedIds.includes(item.id) ? "bg-primary/5" : ""}>
                                                <TableCell>
                                                    <Checkbox 
                                                        checked={selectedIds.includes(item.id)}
                                                        onCheckedChange={(checked) => {
                                                            setSelectedIds(prev => checked ? [...prev, item.id] : prev.filter(id => id !== item.id));
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="font-medium">{item.prenom} {item.nom}</TableCell>
                                                <TableCell>
                                                    <span className="capitalize text-xs px-2 py-0.5 rounded-full bg-muted">{item.profile}</span>
                                                </TableCell>
                                                <TableCell className="max-w-[150px] truncate">{item.organisation}</TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col gap-1">
                                                        <span className={`px-2 py-1 rounded text-[10px] font-bold w-fit
                                                            ${item.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 
                                                              item.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 
                                                              'bg-yellow-100 text-yellow-800'}`}>
                                                            {item.status || 'PENDING'}
                                                        </span>
                                                        {item.email_sent && <span className="text-[9px] text-green-600 font-medium">✓ Email envoyé</span>}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                    <Eye className="w-4 h-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>{item.prenom} {item.nom}</DialogTitle>
                                                                    <DialogDescription>Détails de l'inscription #{item.badge_id?.split('-')[0]}</DialogDescription>
                                                                </DialogHeader>
                                                                <div className="space-y-4 py-4">
                                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                                        <div><p className="text-muted-foreground">Email</p><p className="font-medium">{item.email}</p></div>
                                                                        <div><p className="text-muted-foreground">Téléphone</p><p className="font-medium">{item.telephone}</p></div>
                                                                        <div><p className="text-muted-foreground">Profil</p><p className="font-medium capitalize">{item.profile}</p></div>
                                                                        <div><p className="text-muted-foreground">Région</p><p className="font-medium">{item.region || '-'}</p></div>
                                                                    </div>
                                                                    <div className="border-t pt-4">
                                                                        <p className="text-sm font-bold mb-2">Données spécifiques :</p>
                                                                        <div className="bg-muted p-3 rounded-md text-xs grid grid-cols-2 gap-2">
                                                                            {item.specific_data && Object.entries(item.specific_data).map(([k, v]) => (
                                                                                <div key={k}><span className="font-semibold capitalize">{k}:</span> {String(v)}</div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                        
                                                        <Button variant="outline" size="sm" className="h-8" onClick={() => updateStatus(item.id, 'APPROVED')}>Approuver</Button>
                                                        <Button variant="ghost" size="sm" className="h-8 text-destructive hover:text-destructive" onClick={() => updateStatus(item.id, 'REJECTED')}>Refuser</Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="stats">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card className="p-6">
                                <CardTitle className="text-lg mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5" /> Répartition par Profil
                                </CardTitle>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={stats.profileData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="name" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>

                            <Card className="p-6">
                                <CardTitle className="text-lg mb-4 flex items-center gap-2">
                                    <Users className="w-5 h-5" /> Top 5 Régions
                                </CardTitle>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={stats.regionData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {stats.regionData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="messages">
                        <Card>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Expéditeur</TableHead>
                                            <TableHead>Sujet</TableHead>
                                            <TableHead>Message</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {messages.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>{new Date(item.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{item.nom}</div>
                                                    <div className="text-xs text-muted-foreground">{item.email}</div>
                                                </TableCell>
                                                <TableCell className="font-medium">{item.sujet}</TableCell>
                                                <TableCell className="max-w-md">
                                                    <p className="truncate" title={item.message}>{item.message}</p>
                                                </TableCell>
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
