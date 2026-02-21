import { Resend } from 'resend';

// Use environment variable for security
const resend = new Resend(process.env.RESEND_API_KEY);

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { inscription, type, pdfBase64 } = JSON.parse(event.body);

    let subject = "";
    let htmlContent = "";
    let attachments: any[] = [];

    if (type === 'APPROVAL') {
      subject = `FIAA 2026 - Inscription Validée !`;
      htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #059669; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">FIAA 2026</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #059669; margin-top: 0;">Félicitations ${inscription.prenom} !</h2>
            <p>Nous avons le plaisir de vous informer que votre inscription au <strong>Festival International de l'Agriculture et de l'Agroalimentaire (FIAA 2026)</strong> a été officiellement <strong>validée</strong>.</p>
            <p>Vous trouverez votre badge officiel en pièce jointe de ce mail. Nous vous recommandons de l'imprimer ou de le conserver sur votre téléphone pour fluidifier votre accès à l'événement.</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 25px 0;">
              <h3 style="margin-top: 0; font-size: 16px; color: #475569;">Informations Pratiques</h3>
              <p style="margin: 5px 0; font-size: 14px;">📅 <strong>Dates :</strong> 15 - 20 Avril 2026</p>
              <p style="margin: 5px 0; font-size: 14px;">📍 <strong>Lieu :</strong> Lomé, Togo</p>
            </div>

            <p>Toute l'équipe du FIAA se réjouit de vous accueillir prochainement.</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">© 2026 FIAA - Forum International de l'Agriculture et de l'Agro-Alimentaire</p>
            <p style="margin: 5px 0;"><a href="https://www.fiaa-togo.com" style="color: #059669; text-decoration: none;">www.fiaa-togo.com</a></p>
          </div>
        </div>
      `;
      attachments = [
        {
          filename: `badge-${inscription.prenom}-${inscription.nom}.pdf`,
          content: pdfBase64,
        },
      ];
    } else if (type === 'REJECTION') {
      subject = `FIAA 2026 - Informations sur votre inscription`;
      htmlContent = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
          <div style="background-color: #475569; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">FIAA 2026</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #1e293b; margin-top: 0;">Bonjour ${inscription.prenom},</h2>
            <p>Nous vous remercions de l'intérêt porté au <strong>Festival International de l'Agriculture et de l'Agroalimentaire</strong>.</p>
            <p>Après examen de votre dossier, nous avons le regret de vous informer que nous ne pouvons pas valider votre inscription pour cette édition pour le profil choisi.</p>
            <p>Si vous pensez qu'il s'agit d'une erreur ou si vous souhaitez obtenir plus d'informations, n'hésitez pas à nous contacter en répondant à ce mail ou via notre page de contact.</p>
            <p>Nous vous souhaitons beaucoup de succès dans vos projets futurs.</p>
          </div>
          <div style="background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
            <p style="margin: 0;">© 2026 FIAA - Forum International de l'Agriculture et de l'Agro-Alimentaire</p>
          </div>
        </div>
      `;
    }

    const { data, error } = await resend.emails.send({
      from: 'FIAA 2026 <onboarding@resend.dev>',
      to: [inscription.email],
      subject: subject,
      html: htmlContent,
      attachments: attachments,
    });

    if (error) {
      console.error('Resend Error:', error);
      return { statusCode: 400, body: JSON.stringify({ error }) };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully', data }),
    };
  } catch (error: any) {
    console.error('Function Error:', error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
