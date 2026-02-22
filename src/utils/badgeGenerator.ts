import PDFDocument from 'pdfkit/js/pdfkit.standalone';
import blobStream from 'blob-stream';
import QRCode from 'qrcode';

export const generateBadgeBlob = (inscription: any): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        const generate = async () => {
            try {
                const doc = new PDFDocument({ 
                    size: 'A6', 
                    layout: 'landscape', 
                    margin: 0,
                    info: {
                        Title: `Badge FIAA 2026 - ${inscription.prenom} ${inscription.nom}`,
                        Author: 'FIAA Organization'
                    }
                });
                const stream = doc.pipe(blobStream());

                // --- Colors ---
                const profileColors: Record<string, string> = {
                    'agriculteur': '#10b981', // Emerald 500
                    'startup': '#3b82f6',     // Blue 500
                    'partenaire': '#f59e0b',  // Amber 500
                    'visiteur': '#8b5cf6',    // Violet 500
                    'media': '#eab308',       // Yellow 500
                    'default': '#064e3b'      // Dark Green
                };
                const accentColor = profileColors[inscription.profile] || profileColors.default;

                // 1. Background Base
                doc.rect(0, 0, doc.page.width, doc.page.height).fill('#FFFFFF');

                // 2. Subtle Background Decor
                doc.save();
                doc.fillOpacity(0.03);
                doc.circle(doc.page.width, 0, 150).fill(accentColor);
                doc.circle(0, doc.page.height, 100).fill('#000000');
                doc.restore();

                // 3. Elegant Left Border (Accent)
                doc.rect(0, 0, 12, doc.page.height).fill(accentColor);
                doc.rect(12, 0, 3, doc.page.height).fill('#f3f4f6'); 

                // 4. Header Section
                doc.rect(15, 0, doc.page.width - 15, 45).fill('#f9fafb');
                
                // FIAA Text Logo
                doc.fillColor('#064e3b').fontSize(24).font('Helvetica-Bold').text('FIAA', 35, 12);
                doc.fillColor('#059669').fontSize(14).font('Helvetica').text('2026', 100, 19);
                
                // Event Details (Right aligned)
                doc.fillColor('#6b7280').fontSize(9).font('Helvetica').text('FESTIVAL INTERNATIONAL', 0, 14, { align: 'right', width: doc.page.width - 25 });
                doc.text('DE L\'AGRICULTURE ET DE L\'AGROALIMENTAIRE', 0, 24, { align: 'right', width: doc.page.width - 25 });

                // 5. User Information
                const profileLabel = (inscription.profile || 'VISITEUR').toUpperCase();
                doc.save();
                doc.rect(35, 55, 100, 18).fill(accentColor);
                doc.fillColor('white').fontSize(9).font('Helvetica-Bold').text(profileLabel, 35, 59, { width: 100, align: 'center' });
                doc.restore();

                // Name
                doc.fillColor('#111827').fontSize(28).font('Helvetica-Bold').text(inscription.prenom, 35, 85);
                doc.fontSize(28).text(inscription.nom.toUpperCase(), 35, 110);

                // Secondary Info
                let infoY = 150;
                doc.fillColor('#374151').fontSize(11).font('Helvetica-Bold');
                if (inscription.organisation) {
                    doc.text(inscription.organisation, 35, infoY);
                    infoY += 15;
                }
                doc.fillColor('#6b7280').fontSize(10).font('Helvetica');
                if (inscription.fonction) {
                    doc.text(inscription.fonction, 35, infoY);
                    infoY += 13;
                }
                if (inscription.region) {
                    doc.text(`Région: ${inscription.region.toUpperCase()}`, 35, infoY);
                }

                // 6. QR Code Section
                const qrSize = 85;
                const qrX = doc.page.width - qrSize - 25;
                const qrY = 70;

                // QR Border
                doc.save();
                doc.lineWidth(0.5);
                doc.strokeColor('#e5e7eb');
                doc.rect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10).stroke();
                doc.restore();

                // QR Data
                const qrCodeData = JSON.stringify({
                    id: inscription.id,
                    b: inscription.badge_id,
                    v: inscription.status === 'APPROVED'
                });
                const qrImage = await QRCode.toDataURL(qrCodeData, {
                    margin: 1,
                    color: {
                        dark: '#000000',
                        light: '#ffffff'
                    }
                });
                doc.image(qrImage, qrX, qrY, { width: qrSize });

                // ID below QR
                doc.fontSize(7).fillColor('#9ca3af').font('Helvetica').text(
                    `REF: ${inscription.badge_id?.split('-')[0] || 'N/A'}`, 
                    qrX, 
                    qrY + qrSize + 5, 
                    { width: qrSize, align: 'center' }
                );

                // 7. Footer Section
                doc.rect(15, doc.page.height - 25, doc.page.width - 15, 25).fill('#064e3b');
                doc.fillColor('white').fontSize(8).font('Helvetica-Bold').text('15 - 20 AVRIL 2026 • LOMÉ, TOGO', 35, doc.page.height - 15);
                doc.text('WWW.FIAA-TOGO.COM', 0, doc.page.height - 15, { align: 'right', width: doc.page.width - 25 });

                doc.end();

                stream.on('finish', () => {
                    const blob = stream.toBlob('application/pdf');
                    resolve(blob);
                });

            } catch (error) {
                console.error("Badge Generation Error", error);
                reject(error);
            }
        };
        generate();
    });
};

export const generateBadgePDF = async (inscription: any): Promise<void> => {
    const blob = await generateBadgeBlob(inscription);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `badge-${inscription.prenom}-${inscription.nom}.pdf`;
    link.click();
};
