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

// Generate Badge PDF
app.get('/api/inscriptions/:id/badge', authenticateToken, async (req, res) => {
    try {
        const inscription = await Inscription.findByPk(req.params.id);
        if (!inscription) {
            return res.status(404).json({ message: 'Inscription not found' });
        }

        // Logic Check: Only allow download if Approved (skipped for prototype simplicity/admin access)
        // if (inscription.status !== 'APPROVED') ...

        const doc = new PDFDocument({ size: 'A6', layout: 'landscape' }); // Badge size
        const filename = `badge-${inscription.prenom}-${inscription.nom}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // Badge Design
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F0FDF4'); // Light green background
        
        // Header
        doc.rect(0, 0, doc.page.width, 30).fill('#166534'); // Dark green header
        doc.fillColor('white').fontSize(14).text('FIAA 2026', 10, 8, { align: 'center' });

        // Content
        doc.fillColor('black').fontSize(18).font('Helvetica-Bold').text(`${inscription.prenom} ${inscription.nom.toUpperCase()}`, 0, 50, { align: 'center' });
        doc.fontSize(12).font('Helvetica').text(inscription.profile ? inscription.profile.toUpperCase() : 'VISITEUR', 0, 75, { align: 'center' });
        if (inscription.organisation) {
            doc.fontSize(10).text(inscription.organisation, 0, 90, { align: 'center' });
        }

        // QR Code
        const qrCodeData = JSON.stringify({
            id: inscription.id,
            badgeId: inscription.badgeId,
            name: `${inscription.prenom} ${inscription.nom}`,
            profile: inscription.profile
        });
        const qrImage = await QRCode.toDataURL(qrCodeData);
        doc.image(qrImage, doc.page.width / 2 - 25, 110, { width: 50 });

        // Footer
        doc.fontSize(8).text(`ID: ${inscription.badgeId.split('-')[0]}...`, 0, 170, { align: 'center' });

        doc.end();

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

        // Generate PDF (Same Logic)
        const doc = new PDFDocument({ size: 'A6', layout: 'landscape' });
        const filename = `badge-${inscription.prenom}-${inscription.nom}.pdf`;

        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        doc.pipe(res);

        // Badge Design
        doc.rect(0, 0, doc.page.width, doc.page.height).fill('#F0FDF4');
        
        doc.rect(0, 0, doc.page.width, 30).fill('#166534');
        doc.fillColor('white').fontSize(14).text('FIAA 2026', 10, 8, { align: 'center' });

        doc.fillColor('black').fontSize(18).font('Helvetica-Bold').text(`${inscription.prenom} ${inscription.nom.toUpperCase()}`, 0, 50, { align: 'center' });
        doc.fontSize(12).font('Helvetica').text(inscription.profile ? inscription.profile.toUpperCase() : 'VISITEUR', 0, 75, { align: 'center' });
        if (inscription.organisation) {
            doc.fontSize(10).text(inscription.organisation, 0, 90, { align: 'center' });
        }

        const qrCodeData = JSON.stringify({
            id: inscription.id,
            badgeId: inscription.badgeId,
            name: `${inscription.prenom} ${inscription.nom}`,
            profile: inscription.profile
        });
        const qrImage = await QRCode.toDataURL(qrCodeData);
        doc.image(qrImage, doc.page.width / 2 - 25, 110, { width: 50 });

        doc.fontSize(8).text(`ID: ${inscription.badgeId.split('-')[0]}...`, 0, 170, { align: 'center' });

        doc.end();

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
