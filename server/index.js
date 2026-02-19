import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { initDb, Inscription, Contact } from './database.js';
import QRCode from 'qrcode';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { authenticateToken } from './authMiddleware.js';

// Configure Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'mock_user',
      pass: process.env.SMTP_PASS || 'mock_pass',
    },
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Initialize Database
initDb();

// --- API Routes ---

// Create Inscription
app.post('/api/inscriptions', async (req, res) => {
    try {
        const { nom, prenom, email, telephone, region, organisation, fonction, besoins, profile, ...otherData } = req.body;
        
        // Serialize specific data
        const specificData = JSON.stringify(otherData);

        const inscription = await Inscription.create({
            nom, prenom, email, telephone, region, organisation, fonction, besoins, profile,
            specificData
        });
        res.status(201).json({ message: 'Inscription created successfully', data: inscription });
    } catch (error) {
        console.error('Error creating inscription:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Create Contact Message
app.post('/api/messages', async (req, res) => {
    try {
        const message = await Contact.create(req.body);
        res.status(201).json({ message: 'Message sent successfully', data: message });
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// --- Admin Routes (Mock Auth for now, or simple check) ---

// Login
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const adminUser = process.env.ADMIN_USER;
    const adminPassHash = process.env.ADMIN_PASS_HASH; // Hash stored in .env

    if (!adminUser || !adminPassHash) {
        return res.status(500).json({ message: 'Server misconfiguration: missing admin credentials.' });
    }

    if (username === adminUser) {
        const match = await bcrypt.compare(password, adminPassHash);
        if (match) {
            const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
            return res.json({ token, success: true });
        }
    }
    res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// Get All Inscriptions (Protected)
app.get('/api/inscriptions', authenticateToken, async (req, res) => {
    try {
        const inscriptions = await Inscription.findAll({ order: [['createdAt', 'DESC']] });
        
        // Parse specificData for each inscription
        const parsedInscriptions = inscriptions.map(i => {
            const plain = i.get({ plain: true });
            try {
                plain.specificData = plain.specificData ? JSON.parse(plain.specificData) : {};
            } catch (e) {
                plain.specificData = {};
            }
            return plain;
        });

        res.json(parsedInscriptions);
    } catch (error) {
        console.error('Error fetching inscriptions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get All Messages
app.get('/api/messages', authenticateToken, async (req, res) => {
    try {
        const messages = await Contact.findAll({ order: [['createdAt', 'DESC']] });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Check Status Endpoint (Public)
app.get('/api/inscriptions/check', async (req, res) => {
    const { email } = req.query;
    try {
        const inscription = await Inscription.findOne({ where: { email } });
        if (inscription) {
            res.json({ data: inscription });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Helper Function for Badge Generation
const generateBadgePDF = async (inscription, res) => {
    const doc = new PDFDocument({ size: 'A6', layout: 'landscape', margin: 0 }); // No default margin for full bleed
    const filename = `badge-${inscription.prenom}-${inscription.nom}.pdf`;

    res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);

    // --- Badge Design ---

    // 1. Profile Colors
    const profileColors = {
        'agriculteur': '#059669', // Emerald 600
        'startup': '#2563EB',     // Blue 600
        'partenaire': '#D97706',  // Amber 600 (Gold-ish)
        'visiteur': '#9333EA',    // Purple 600
        'media': '#EAB308',       // Yellow 500
    };
    const baseColor = profileColors[inscription.profile] || '#166534'; // Default Green

    // 2. Background
    doc.rect(0, 0, doc.page.width, doc.page.height).fill('#FFFFFF'); 
    
    // 3. Colored Sidebar (Strip)
    doc.rect(0, 0, 30, doc.page.height).fill(baseColor);
    
    // 4. Header Bar
    doc.rect(30, 0, doc.page.width - 30, 40).fill('#166534'); // FIAA Green
    doc.fillColor('white').fontSize(16).font('Helvetica-Bold').text('FIAA 2026', 40, 12, { align: 'left' });
    doc.fontSize(10).font('Helvetica').text('15-20 Avril • Lomé, Togo', 0, 15, { align: 'right', width: doc.page.width - 20 });

    // 5. Participant Info
    const startX = 50;
    let currentY = 60;

    // Name
    doc.fillColor('black').fontSize(22).font('Helvetica-Bold').text(`${inscription.prenom}`, startX, currentY);
    currentY += 25;
    doc.text(`${inscription.nom.toUpperCase()}`, startX, currentY);
    currentY += 30;

    // Profile Badge
    doc.rect(startX, currentY - 5, 120, 25).fill(baseColor);
    doc.fillColor('white').fontSize(12).font('Helvetica-Bold').text(
        (inscription.profile ? inscription.profile.toUpperCase() : 'VISITEUR'), 
        startX, currentY + 2, { width: 120, align: 'center' }
    );
    
    // Reset for Details
    currentY += 35;
    doc.fillColor('#374151'); // Gray 700

    // Box for Details
    doc.fontSize(10).font('Helvetica');
    if (inscription.organisation) {
        doc.text(inscription.organisation, startX, currentY);
        currentY += 14;
    }
    if (inscription.fonction) {
        doc.fillColor('#6B7280').text(inscription.fonction, startX, currentY); // Gray 500
        currentY += 14;
    }
    if (inscription.region) {
         doc.fillColor('#6B7280').text(inscription.region.toUpperCase(), startX, currentY);
    }

    // 6. QR Code (Right Side)
    const qrCodeData = JSON.stringify({
        id: inscription.id,
        badgeId: inscription.badgeId,
        name: `${inscription.prenom} ${inscription.nom}`,
        profile: inscription.profile,
        valid: inscription.status === 'APPROVED'
    });
    
    try {
        const qrImage = await QRCode.toDataURL(qrCodeData);
        // Position QR code on the right
        doc.image(qrImage, doc.page.width - 90, 60, { width: 70 });
        
        // Badge ID below QR
        doc.fontSize(8).fillColor('#9CA3AF').text(
            `ID: ${inscription.badgeId.split('-')[0]}`, 
            doc.page.width - 90, 
            135, 
            { width: 70, align: 'center' }
        );
    } catch (err) {
        console.error("QR Gen Error", err);
    }

    // 7. Footer
    const footerY = doc.page.height - 20;
    doc.fontSize(8).fillColor('#166534').text('www.fiaa-togo.com', 30, footerY, { align: 'center', width: doc.page.width - 30 });

    doc.end();
};

// Generate Badge PDF (Protected)
app.get('/api/inscriptions/:id/badge', authenticateToken, async (req, res) => {
    try {
        const inscription = await Inscription.findByPk(req.params.id);
        if (!inscription) {
            return res.status(404).json({ message: 'Inscription not found' });
        }
        await generateBadgePDF(inscription, res);
    } catch (error) {
        console.error('Error generating badge:', error);
        res.status(500).json({ message: 'Error generating badge' });
    }
});

// Public Badge Endpoint (Secure via UUID)
app.get('/api/badges/:badgeId', async (req, res) => {
    try {
        const { badgeId } = req.params;
        const inscription = await Inscription.findOne({ where: { badgeId } });
        
        if (!inscription) {
            return res.status(404).json({ message: 'Badge not found' });
        }
        await generateBadgePDF(inscription, res);

    } catch (error) {
        console.error('Error generating badge:', error);
        res.status(500).json({ message: 'Error generating badge' });
    }
});

// Update Inscription Status (Validation)
app.patch('/api/inscriptions/:id/status', authenticateToken, async (req, res) => {
    const { status } = req.body; // APPROVED, REJECTED
    try {
        const inscription = await Inscription.findByPk(req.params.id);
        if (!inscription) {
            return res.status(404).json({ message: 'Inscription not found' });
        }

        inscription.status = status;
        await inscription.save();

        // Send Email Notification
        const subject = status === 'APPROVED' ? 'FIAA 2026 - Inscription Validée' : 'FIAA 2026 - Mise à jour de votre inscription';
        const text = status === 'APPROVED' 
            ? `Félicitations ${inscription.prenom}, votre inscription est validée ! Vous pouvez télécharger votre badge.`
            : `Bonjour ${inscription.prenom}, votre dossier est en cours de révision ou a été refusé.`;

        // Mock Email Sending
        try {
            await transporter.sendMail({ from: `"FIAA" <${process.env.SMTP_USER}>`, to: inscription.email, subject, text });
            console.log(`[EMAIL SENT] to ${inscription.email}`);
        } catch (emailError) {
             console.error('Error sending email:', emailError);
             // Don't fail the request if email fails, but log it
        }

        res.json({ message: `Status updated to ${status}`, data: inscription });

    } catch (error) {
        console.error('Error updating status:', error);
        res.status(500).json({ message: 'Error updating status' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
