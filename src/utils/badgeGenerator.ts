import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import QRCode from 'qrcode';

export const generateBadgePDF = async (inscription: any): Promise<void> => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({ size: 'A6', layout: 'landscape', margin: 0 });
            const stream = doc.pipe(blobStream());

            // --- Badge Design ---
            const profileColors: Record<string, string> = {
                'agriculteur': '#059669', // Emerald 600
                'startup': '#2563EB',     // Blue 600
                'partenaire': '#D97706',  // Amber 600
                'visiteur': '#9333EA',    // Purple 600
                'media': '#EAB308',       // Yellow 500
            };
            const baseColor = profileColors[inscription.profile] || '#166534';

            // Background
            doc.rect(0, 0, doc.page.width, doc.page.height).fill('#FFFFFF'); 
            
            // Colored Sidebar
            doc.rect(0, 0, 30, doc.page.height).fill(baseColor);
            
            // Header Bar
            doc.rect(30, 0, doc.page.width - 30, 40).fill('#166534'); 
            doc.fillColor('white').fontSize(16).text('FIAA 2026', 40, 12);
            doc.fontSize(10).text('15-20 Avril • Lomé, Togo', 0, 15, { align: 'right', width: doc.page.width - 20 });

            // Participant Info
            const startX = 50;
            let currentY = 60;

            doc.fillColor('black').fontSize(22).text(`${inscription.prenom}`, startX, currentY);
            currentY += 25;
            doc.text(`${inscription.nom.toUpperCase()}`, startX, currentY);
            currentY += 30;

            // Profile Badge
            doc.rect(startX, currentY - 5, 120, 25).fill(baseColor);
            doc.fillColor('white').fontSize(12).text(
                (inscription.profile ? inscription.profile.toUpperCase() : 'VISITEUR'), 
                startX, currentY + 2, { width: 120, align: 'center' }
            );
            
            currentY += 35;
            doc.fillColor('#374151');

            doc.fontSize(10);
            if (inscription.organisation) {
                doc.text(inscription.organisation, startX, currentY);
                currentY += 14;
            }
            if (inscription.fonction) {
                doc.fillColor('#6B7280').text(inscription.fonction, startX, currentY);
                currentY += 14;
            }
            if (inscription.region) {
                 doc.fillColor('#6B7280').text(inscription.region.toUpperCase(), startX, currentY);
            }

            // QR Code
            const qrCodeData = JSON.stringify({
                id: inscription.id,
                badge_id: inscription.badge_id,
                name: `${inscription.prenom} ${inscription.nom}`,
                profile: inscription.profile,
                valid: inscription.status === 'APPROVED'
            });
            
            const qrImage = await QRCode.toDataURL(qrCodeData);
            doc.image(qrImage, doc.page.width - 90, 60, { width: 70 });
            
            doc.fontSize(8).fillColor('#9CA3AF').text(
                `ID: ${inscription.badge_id?.split('-')[0]}`, 
                doc.page.width - 90, 
                135, 
                { width: 70, align: 'center' }
            );

            // Footer
            doc.fontSize(8).fillColor('#166534').text('www.fiaa-togo.com', 30, doc.page.height - 20, { align: 'center', width: doc.page.width - 30 });

            doc.end();

            stream.on('finish', () => {
                const blob = stream.toBlob('application/pdf');
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `badge-${inscription.prenom}-${inscription.nom}.pdf`;
                link.click();
                resolve();
            });

        } catch (error) {
            console.error("Badge Generation Error", error);
            reject(error);
        }
    });
};
