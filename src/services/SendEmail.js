// Send email to user
// const nodemailer = require('nodemailer');
// require('dotenv').config();

const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL || 'onjaniainamapionona@gmail.com',
        pass: process.env.SMTP_PASSWORD, // Vous devez ajouter cette variable dans .env
    },
});

// Email à l'admin pour nouveau rendez-vous
const sendAppointmentNotificationToAdmin = async (appointmentData) => {
    const { patient, date, time } = appointmentData;

    const mailOptions = {
        from: process.env.SMTP_EMAIL || 'onjaniainamapionona@gmail.com',
        to: 'onjaniainamapionona@gmail.com',
        subject: '🔔 Nouveau rendez-vous - Centre Vision Laser',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #0C2340, #0f2e52); padding: 20px; text-align: center;">
                    <h2 style="color: #C9A84C; margin: 0;">Centre Vision Laser</h2>
                    <p style="color: white; margin: 5px 0 0;">Nouvelle demande de rendez-vous</p>
                </div>
                
                <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
                    <h3 style="color: #0C2340;">📅 Rendez-vous confirmé</h3>
                    
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Patient</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${patient.firstName} ${patient.lastName}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${patient.email}</td>
                        </tr>
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Téléphone</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${patient.phone}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date de naissance</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${patient.birthDate || 'Non renseignée'}</td>
                        </tr>
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Motif</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${patient.motif}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Date du rendez-vous</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${date}</td>
                        </tr>
                        <tr style="background: #f5f5f5;">
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Heure</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${time}</td>
                        </tr>
                        ${patient.notes ? `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Informations complémentaires</strong></td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${patient.notes}</td>
                        </tr>
                        ` : ''}
                    </table>
                    
                    <p style="margin-top: 20px; color: #666; font-size: 12px;">
                        Cet email a été envoyé automatiquement. Merci de contacter le patient dans les plus brefs délais.
                    </p>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email envoyé à l\'admin:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Erreur envoi email admin:', error);
        throw error;
    }
};

// Email de confirmation à l'utilisateur
const sendAppointmentConfirmationToUser = async (appointmentData) => {
    const { patient, date, time } = appointmentData;

    // Formater la date pour l'affichage
    const dateFormatted = new Date(date + "T12:00:00").toLocaleDateString("fr-FR", {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    const mailOptions = {
        from: process.env.SMTP_EMAIL || 'onjaniainamapionona@gmail.com',
        to: patient.email,
        subject: '✅ Confirmation de votre rendez-vous - Centre Vision Laser',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <div style="background: linear-gradient(135deg, #0C2340, #0f2e52); padding: 20px; text-align: center;">
                    <h2 style="color: #C9A84C; margin: 0;">Centre Vision Laser</h2>
                    <p style="color: white; margin: 5px 0 0;">Votre rendez-vous est confirmé</p>
                </div>
                
                <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <div style="font-size: 48px;">📅</div>
                        <h3 style="color: #0C2340; margin: 10px 0 0;">Rendez-vous confirmé</h3>
                    </div>
                    
                    <p style="color: #333; line-height: 1.6;">
                        Bonjour <strong>${patient.firstName} ${patient.lastName}</strong>,
                    </p>
                    
                    <p style="color: #333; line-height: 1.6;">
                        Nous avons bien enregistré votre demande de rendez-vous pour le :
                    </p>
                    
                    <div style="background: #f5f5f5; padding: 15px; border-radius: 10px; text-align: center; margin: 20px 0;">
                        <p style="margin: 0; color: #0C2340;">
                            <strong style="font-size: 18px;">${dateFormatted}</strong>
                        </p>
                        <p style="margin: 5px 0 0; color: #C9A84C;">
                            <strong>à ${time}</strong>
                        </p>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <p style="color: #333; margin: 5px 0;"><strong>Motif :</strong> ${patient.motif}</p>
                        ${patient.notes ? `<p style="color: #333; margin: 5px 0;"><strong>Informations complémentaires :</strong> ${patient.notes}</p>` : ''}
                    </div>
                    
                    <div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin: 20px 0;">
                        <p style="color: #2e7d32; margin: 0; font-size: 14px;">
                            <strong>📍 Informations pratiques</strong><br>
                            Centre Vision Laser<br>
                            123 Avenue de la Vision, 75000 Paris<br>
                            Tel: 01 23 45 67 89<br>
                            Parking gratuit disponible
                        </p>
                    </div>
                    
                    <p style="color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 15px;">
                        Pour toute modification ou annulation, merci de nous contacter directement au 01 23 45 67 89.
                        <br><br>
                        Cet email est un accusé de réception automatique. Merci de ne pas y répondre.
                    </p>
                </div>
            </div>
        `,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email de confirmation envoyé à l\'utilisateur:', info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('Erreur envoi email utilisateur:', error);
        throw error;
    }
};

// Fonction principale pour envoyer les deux emails
const sendAppointmentEmails = async (appointmentData) => {
    try {
        // Envoyer les deux emails en parallèle
        await Promise.all([
            sendAppointmentNotificationToAdmin(appointmentData),
            sendAppointmentConfirmationToUser(appointmentData)
        ]);
        console.log('Emails envoyés avec succès');
        return { success: true };
    } catch (error) {
        console.error('Erreur lors de l\'envoi des emails:', error);
        throw error;
    }
};

module.exports = {
    sendAppointmentNotificationToAdmin,
    sendAppointmentConfirmationToUser,
    sendAppointmentEmails,
};