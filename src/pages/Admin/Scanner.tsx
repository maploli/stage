import { useEffect, useState, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";
import { Loader2, Camera, CheckCircle2, XCircle, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";

interface InscriptionData {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  profile: string;
  organisation?: string;
  status: string;
  badge_id?: string;
  region?: string;
  specific_data?: Record<string, any>;
  telephone?: string;
}

const Scanner = () => {
    const { t } = useLanguage();
    const [scanResult, setScanResult] = useState<InscriptionData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(true);
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (isScanning) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scannerRef.current.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Failed to clear scanner", err));
            }
        };
    }, [isScanning]);

    const onScanSuccess = async (decodedText: string) => {
        try {
            const data = JSON.parse(decodedText);
            if (!data.id) throw new Error("Format QR Code invalide");

            // Pause scanning
            setIsScanning(false);
            if (scannerRef.current) {
                await scannerRef.current.clear();
            }

            setLoading(true);
            const { data: inscription, error } = await supabase
                .from('inscriptions')
                .select('*')
                .eq('id', data.id)
                .single();

            if (error || !inscription) throw new Error("Inscription introuvable");

            setScanResult(inscription as InscriptionData);
            if (inscription.status === 'APPROVED') {
                toast.success(`Badge validé : ${inscription.prenom} ${inscription.nom}`);
            } else {
                toast.warning(`Attention : Inscription non approuvée (${inscription.status})`);
            }
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Code invalide";
            toast.error("Erreur de scan : " + message);
            setIsScanning(true);
        } finally {
            setLoading(false);
        }
    };

    const onScanFailure = () => {
        // Silently ignore failures (it happens constantly during scanning)
    };

    const resetScanner = () => {
        setScanResult(null);
        setIsScanning(true);
    };

    return (
        <Layout>
            <div className="container mx-auto py-12 px-4 max-w-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="ghost" asChild>
                        <Link to="/admin/dashboard">
                            <ArrowLeft className="mr-2 w-4 h-4" />
                            Retour Dashboard
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold">Contrôle d'Accès</h1>
                </div>

                <Card className="overflow-hidden border-2">
                    <CardHeader className="bg-muted/50 border-b">
                        <CardTitle className="flex items-center gap-2">
                            <Camera className="w-5 h-5 text-primary" />
                            Scanner un Badge
                        </CardTitle>
                        <CardDescription>
                            Placez le QR Code du badge devant votre caméra pour vérification.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        {isScanning ? (
                            <div id="reader" className="w-full rounded-lg overflow-hidden border"></div>
                        ) : (
                            <div className="space-y-6 py-4">
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-12">
                                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                        <p className="mt-4 text-muted-foreground font-medium text-lg">Recherche des informations...</p>
                                    </div>
                                ) : scanResult ? (
                                    <div className="text-center animate-in fade-in zoom-in duration-300">
                                        <div className="flex justify-center mb-4">
                                            {scanResult.status === 'APPROVED' ? (
                                                <div className="p-4 rounded-full bg-green-100 text-green-600 ring-8 ring-green-50">
                                                    <CheckCircle2 className="w-16 h-16" />
                                                </div>
                                            ) : (
                                                <div className="p-4 rounded-full bg-red-100 text-red-600 ring-8 ring-red-50">
                                                    <XCircle className="w-16 h-16" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <h2 className="text-3xl font-bold text-foreground">
                                            {scanResult.prenom} {scanResult.nom.toUpperCase()}
                                        </h2>
                                        <p className="text-xl font-semibold text-primary mt-1">
                                            {scanResult.profile?.toUpperCase()}
                                        </p>
                                        
                                        <div className="mt-6 grid grid-cols-2 gap-4 text-left border p-4 rounded-xl bg-muted/30">
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground font-bold">Organisation</p>
                                                <p className="font-medium text-foreground">{scanResult.organisation || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground font-bold">Statut</p>
                                                <p className={scanResult.status === 'APPROVED' ? "font-bold text-green-600" : "font-bold text-red-600"}>
                                                    {scanResult.status === 'APPROVED' ? "ACCÈS AUTORISÉ" : "ACCÈS REFUSÉ"}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground font-bold">Région</p>
                                                <p className="font-medium text-foreground">{scanResult.region || "N/A"}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase text-muted-foreground font-bold">ID Badge</p>
                                                <p className="font-mono text-xs">{scanResult.badge_id || "N/A"}</p>
                                            </div>
                                        </div>

                                        <Button className="w-full mt-8 py-6 text-lg" onClick={resetScanner}>
                                            Scanner le suivant
                                            <Camera className="ml-2 w-5 h-5" />
                                        </Button>
                                    </div>
                                ) : null}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
};

export default Scanner;
