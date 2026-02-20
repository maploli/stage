import { Resend } from 'resend';

// NOTE: Ideally this should be a secret in Supabase Edge Functions.
// For now, we use the provided key directly as requested for the MVP.
const resend = new Resend('re_9e6M9vsq_8XF6U6vLscv19fU6Wn2S7L85');

export const sendApprovalEmail = async (inscription: any, pdfBlob: Blob) => {
    try {
        // Convert Blob to Base64 for Resend attachment
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
            reader.onloadend = () => {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            };
        });
        reader.readAsDataURL(pdfBlob);
        const pdfBase64 = await base64Promise;

        const { data, error } = await resend.emails.send({
            from: 'FIAA 2026 <onboarding@resend.dev>', // Should be a verified domain in production
            to: [inscription.email],
            subject: `FIAA 2026 - Inscription Validée !`,
            html: `
                <div style="font-family: sans-serif; line-height: 1.6; color: #1a1a1a;">
                    <h2 style="color: #059669;">Félicitations ${inscription.prenom} !</h2>
                    <p>Votre inscription au <strong>FIAA 2026</strong> a été officiellement <strong>validée</strong> par l'équipe administrative.</p>
                    <p>Vous trouverez ci-joint votre badge officiel au format PDF. Veuillez le conserver précieusement, il sera nécessaire pour accéder à l'événement.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="font-size: 0.9em; color: #666;">
                        <strong>Dates :</strong> 15-20 Avril 2026<br />
                        <strong>Lieu :</strong> Lomé, Togo<br />
                        <strong>Site web :</strong> www.fiaa-togo.com
                    </p>
                </div>
            `,
            attachments: [
                {
                    filename: `badge-${inscription.prenom}-${inscription.nom}.pdf`,
                    content: pdfBase64,
                },
            ],
        });

        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
