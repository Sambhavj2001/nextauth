import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from '@/modals/userModal';
dotenv.config();
const EMAIL_USER = process.env.EMAIL_USER || '';
const EMAIL_PASS = process.env.EMAIL_PASS || '';

export const sendEmail = async ({ email, emailType, userId }: { email: string, emailType: string, userId: object }) => {
    try {
        const hashedToken = await bcrypt.hash(userId.toString(), 10);
        let message = '';
        if (emailType === "VERIFY") {
            const verifyUrl = `${process.env.DOMAIN}/verify-email?token=${hashedToken}`;
            message = `Please verify your email by clicking on the following link: ${verifyUrl}`;
            await User.findByIdAndUpdate(userId,{$set: { verificationToken: hashedToken, verificationTokenExpiry: Date.now() + 3600000 }}); // 1 hour expiry
        } else if (emailType === "RESET") {
            const resetUrl = `${process.env.DOMAIN}/reset-password?token=${hashedToken}`;
            message = `You can reset your password by clicking on the following link: ${resetUrl}`;
            await User.findByIdAndUpdate(userId, { $set: { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 3600000, }, },); // 1 hour expiry 
        }
        const transporter = nodemailer.createTransport({
            host: 'smtp.mailtrap.io',
            port: 587,
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: "sample@email.com",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>${message}</p>`,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', mailResponse);
        return mailResponse;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};