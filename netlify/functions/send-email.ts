import { Resend } from 'resend';

const resend = new Resend('re_9e6M9vsq_8XF6U6vLscv19fU6Wn2S7L85');

export const handler = async (event: any) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { inscription, pdfBase64 } = JSON.parse(event.body);

    const { data, error } = await resend.emails.send({
      from: 'FIAA 2026 <onboarding@resend.dev>',
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

    if (error) {
      console.error('Resend Error:', error);
      return {
        statusCode: 400,
        body: JSON.stringify({ error }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Email sent successfully', data }),
    };
  } catch (error: any) {
    console.error('Function Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
