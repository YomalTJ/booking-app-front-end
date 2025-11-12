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
      to: user.email,
      subject: `Booking Confirmation - ${bookingData.bookingId}`,
      html: BOOKING_CONFIRMATION_TEMPLATE(bookingData, user),
    };

    // Send notification to admin
    const adminMailData = {
      from: `Coworking Cube <${process.env.SMTP_FROM_EMAIL}>`,
      to: `${process.env.EMAIL_TO_ONE}, ${process.env.EMAIL_TO_TWO}`,
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
