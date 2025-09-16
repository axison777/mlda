const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendWelcomeEmail(user) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Bienvenue sur MLDA - Meine Liebe Deutsche Academy',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Bienvenue ${user.firstName} !</h1>
            <p>Nous sommes ravis de vous accueillir sur MLDA, votre plateforme d'apprentissage de l'allemand.</p>
            <p>Vous pouvez maintenant :</p>
            <ul>
              <li>Explorer notre catalogue de cours</li>
              <li>Suivre votre progression</li>
              <li>Passer des quiz interactifs</li>
            </ul>
            <p>Viel Erfolg beim Deutschlernen!</p>
            <p><strong>L'équipe MLDA</strong></p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending welcome email:', error);
    }
  }

  async sendCourseEnrollmentEmail(user, course) {
    try {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Inscription confirmée - ${course.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #2563eb;">Inscription confirmée !</h1>
            <p>Bonjour ${user.firstName},</p>
            <p>Votre inscription au cours <strong>"${course.title}"</strong> a été confirmée.</p>
            <p>Vous pouvez maintenant accéder à toutes les leçons et commencer votre apprentissage.</p>
            <p>Bonne chance dans votre apprentissage de l'allemand !</p>
            <p><strong>L'équipe MLDA</strong></p>
          </div>
        `
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Error sending enrollment email:', error);
    }
  }
}

module.exports = new EmailService();