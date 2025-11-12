import nodemailer from "nodemailer";

// Create transporter
const transporter = nodemailer.createTransport({
  port: parseInt(process.env.SMTP_PORT || "465"),
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  auth: {
    user: process.env.SMTP_FROM_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  secure: true,
});

export interface BookingEmailData {
  bookingId: string;
  roomName: string;
  date: string;
  timeSlot: string;
  duration: string;
  isFullDay: boolean;
  hoursUsed?: number;
  remainingHours?: number;
}

export interface UserData {
  name: string;
  email: string;
  companyName: string;
  phoneNumber?: string;
}

export interface RegistrationData {
  name: string;
  email: string;
  companyName: string;
  phoneNumber: string;
}

export const sendBookingConfirmationEmail = async (
  user: UserData,
  bookingData: BookingEmailData
) => {
  try {
    const { BOOKING_CONFIRMATION_TEMPLATE, BOOKING_NOTIFICATION_TEMPLATE } =
      await import("./emailTemplates");

    // Send confirmation to user
    const userMailData = {
      from: `Coworking Cube <${process.env.SMTP_FROM_EMAIL}>`,
      to: user.email, // Use user's email from the user object
      subject: `Booking Confirmation - ${user.companyName}`,
      html: BOOKING_CONFIRMATION_TEMPLATE(bookingData, user),
    };

    // Send notification to admin - use a fallback if environment variables are not set
    const adminEmails = [];

    // Add primary admin email if available
    if (process.env.EMAIL_TO_ONE) {
      adminEmails.push(process.env.EMAIL_TO_ONE);
    }

    // Add secondary admin email if available
    if (process.env.EMAIL_TO_TWO) {
      adminEmails.push(process.env.EMAIL_TO_TWO);
    }

    // If no admin emails are configured, at least send to the from email
    if (adminEmails.length === 0) {
      adminEmails.push(process.env.SMTP_FROM_EMAIL);
    }

    const adminMailData = {
      from: `Coworking Cube <${process.env.SMTP_FROM_EMAIL}>`,
      to: adminEmails.join(", "),
      subject: `New Booking - ${bookingData.bookingId}`,
      html: BOOKING_NOTIFICATION_TEMPLATE(bookingData, user),
    };

    // Send both emails
    await transporter.sendMail(userMailData);
    await transporter.sendMail(adminMailData);

    console.log("Booking confirmation emails sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending booking confirmation emails:", error);
    return false;
  }
};

export const sendRegistrationConfirmationEmail = async (
  user: RegistrationData
) => {
  try {
    const {
      REGISTRATION_CONFIRMATION_TEMPLATE,
      REGISTRATION_NOTIFICATION_TEMPLATE,
    } = await import("./emailTemplates");

    // Send welcome email to new user
    const userMailData = {
      from: `Coworking Cube <${process.env.SMTP_FROM_EMAIL}>`,
      to: user.email,
      subject: `Welcome to Coworking Cube - Account Created Successfully`,
      html: REGISTRATION_CONFIRMATION_TEMPLATE(user),
    };

    // Send notification to admin about new registration
    const adminEmails = [];

    if (process.env.EMAIL_TO_ONE) {
      adminEmails.push(process.env.EMAIL_TO_ONE);
    }

    if (process.env.EMAIL_TO_TWO) {
      adminEmails.push(process.env.EMAIL_TO_TWO);
    }

    if (adminEmails.length === 0) {
      adminEmails.push(process.env.SMTP_FROM_EMAIL);
    }

    const adminMailData = {
      from: `Coworking Cube <${process.env.SMTP_FROM_EMAIL}>`,
      to: adminEmails.join(", "),
      subject: `New User Registration - ${user.name}`,
      html: REGISTRATION_NOTIFICATION_TEMPLATE(user),
    };

    // Send both emails
    await transporter.sendMail(userMailData);
    await transporter.sendMail(adminMailData);

    console.log("Registration confirmation emails sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending registration confirmation emails:", error);
    return false;
  }
};

export const sendPasswordResetOtpEmail = async (
  user: UserData,
  otp: string
) => {
  try {
    const { PASSWORD_RESET_OTP_TEMPLATE } = await import("./emailTemplates");

    const mailData = {
      from: `Coworking Cube <${process.env.SMTP_FROM_EMAIL}>`,
      to: user.email,
      subject: `Password Reset Verification Code - Coworking Cube`,
      html: PASSWORD_RESET_OTP_TEMPLATE(user, otp),
    };

    await transporter.sendMail(mailData);
    console.log("Password reset OTP email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending password reset OTP email:", error);
    return false;
  }
};

export const sendPasswordResetSuccessEmail = async (user: UserData) => {
  try {
    const { PASSWORD_RESET_SUCCESS_TEMPLATE } = await import(
      "./emailTemplates"
    );

    const mailData = {
      from: `Coworking Cube <${process.env.SMTP_FROM_EMAIL}>`,
      to: user.email,
      subject: `Password Reset Successful - Coworking Cube`,
      html: PASSWORD_RESET_SUCCESS_TEMPLATE(user),
    };

    await transporter.sendMail(mailData);
    console.log("Password reset success email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending password reset success email:", error);
    return false;
  }
};
