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
        let htmlMessage = '';
        if (emailType === "VERIFY") {
            const verifyUrl = `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`;
            message = `Please verify your email by clicking on the following link: ${verifyUrl}`;
            htmlMessage = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; text-align: center;">Verify Your Email</h2>
                    <p style="color: #666; line-height: 1.6;">
                        Thank you for signing up! Please verify your email address by clicking the button below:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${verifyUrl}"
                           style="background-color: #4F46E5; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                            Verify Email Address
                        </a>
                    </div>
                    <p style="color: #999; font-size: 14px;">
                        If the button doesn't work, you can also copy and paste this link into your browser:<br>
                        <a href="${verifyUrl}" style="color: #4F46E5; word-break: break-all;">${verifyUrl}</a>
                    </p>
                    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 40px;">
                        This link will expire in 1 hour.
                    </p>
                </div>
            `;
            await User.findByIdAndUpdate(userId,{$set: { verificationToken: hashedToken, verificationTokenExpiry: Date.now() + 3600000 }}); // 1 hour expiry
        } else if (emailType === "RESET") {
            const resetUrl = `${process.env.DOMAIN}/resetpassword?token=${hashedToken}`;
            message = `You can reset your password by clicking on the following link: ${resetUrl}`;
            htmlMessage = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
                    <p style="color: #666; line-height: 1.6;">
                        You requested a password reset. Click the button below to reset your password:
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="${resetUrl}"
                           style="background-color: #DC2626; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p style="color: #999; font-size: 14px;">
                        If the button doesn't work, you can also copy and paste this link into your browser:<br>
                        <a href="${resetUrl}" style="color: #DC2626; word-break: break-all;">${resetUrl}</a>
                    </p>
                    <p style="color: #999; font-size: 12px; text-align: center; margin-top: 40px;">
                        This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
                    </p>
                </div>
            `;
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
            html: htmlMessage,
        };

        const mailResponse = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', mailResponse);
        return mailResponse;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};