export const BOOKING_CONFIRMATION_TEMPLATE = (
  bookingDetails: any,
  user: any
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f8fafc;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e2e8f0;
        }
        .booking-details {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #f97316;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .detail-label {
            font-weight: 600;
            color: #64748b;
        }
        .detail-value {
            font-weight: 600;
            color: #1e293b;
        }
        .hours-info {
            background: #fffbeb;
            border: 1px solid #fed7aa;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
        .company-name {
            color: #f97316;
            font-weight: bold;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Booking Confirmed!</h1>
        <p>Your meeting room reservation has been successfully created</p>
    </div>
    
    <div class="content">
        <p>Dear <strong>${user.name}</strong>,</p>
        
        <p>Thank you for booking with Coworking Cube. Here are your booking details:</p>
        
        <div class="booking-details">
            <div class="detail-row">
                <span class="detail-label">Booking Reference:</span>
                <span class="detail-value">${bookingDetails.bookingId}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Room:</span>
                <span class="detail-value">${bookingDetails.roomName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Date:</span>
                <span class="detail-value">${bookingDetails.date}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Time Slot:</span>
                <span class="detail-value">${bookingDetails.timeSlot}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Duration:</span>
                <span class="detail-value">${bookingDetails.duration}</span>
            </div>
            ${
              bookingDetails.hoursUsed
                ? `
            <div class="detail-row">
                <span class="detail-label">Hours Used:</span>
                <span class="detail-value">${bookingDetails.hoursUsed} hours</span>
            </div>
            `
                : ""
            }
        </div>

        ${
          bookingDetails.remainingHours !== undefined
            ? `
        <div class="hours-info">
            <h3>📊 Company Hours Update</h3>
            <p><strong>Remaining Hours:</strong> ${bookingDetails.remainingHours} hours</p>
            <p><strong>Company:</strong> ${user.companyName}</p>
        </div>
        `
            : ""
        }

        <p><strong>Important Notes:</strong></p>
        <ul>
            <li>Please arrive on time for your booking</li>
            <li>Keep the meeting room clean and organized</li>
            <li>Notify us if you need to cancel or modify your booking</li>
            <li>Contact support if you have any questions</li>
        </ul>

        <div class="footer">
            <p>Thank you for choosing <span class="company-name">Coworking Cube</span></p>
            <p>📍 Kottawa & Mirissa Branches</p>
            <p>📞 Contact: +94 XX XXX XXXX | ✉️ support@coworkingcube.com</p>
        </div>
    </div>
</body>
</html>`;

export const BOOKING_NOTIFICATION_TEMPLATE = (
  bookingDetails: any,
  user: any
) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Booking Notification</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #059669, #047857);
            color: white;
            padding: 25px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f0fdf4;
            padding: 25px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #bbf7d0;
        }
        .booking-info {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #059669;
        }
        .info-section {
            margin-bottom: 15px;
            padding: 12px;
            background: #f8fafc;
            border-radius: 6px;
        }
        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 10px;
        }
        .detail-item {
            padding: 8px;
            border-bottom: 1px solid #e2e8f0;
        }
        .label {
            font-weight: 600;
            color: #475569;
            font-size: 14px;
        }
        .value {
            font-weight: 600;
            color: #1e293b;
        }
        .urgent {
            background: #fef2f2;
            border: 1px solid #fecaca;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>📋 New Booking Created</h1>
        <p>A new meeting room booking has been made in the system</p>
    </div>
    
    <div class="content">
        <div class="info-section">
            <h3>👤 User Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="label">Name:</div>
                    <div class="value">${user.name}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Email:</div>
                    <div class="value">${user.email}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Company:</div>
                    <div class="value">${user.companyName}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Booking ID:</div>
                    <div class="value">${bookingDetails.bookingId}</div>
                </div>
            </div>
        </div>

        <div class="info-section">
            <h3>📅 Booking Details</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="label">Room:</div>
                    <div class="value">${bookingDetails.roomName}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Date:</div>
                    <div class="value">${bookingDetails.date}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Time Slot:</div>
                    <div class="value">${bookingDetails.timeSlot}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Duration:</div>
                    <div class="value">${bookingDetails.duration}</div>
                </div>
                ${
                  bookingDetails.hoursUsed
                    ? `
                <div class="detail-item">
                    <div class="label">Hours Used:</div>
                    <div class="value">${bookingDetails.hoursUsed} hours</div>
                </div>
                `
                    : ""
                }
                ${
                  bookingDetails.remainingHours !== undefined
                    ? `
                <div class="detail-item">
                    <div class="label">Remaining Hours:</div>
                    <div class="value">${bookingDetails.remainingHours} hours</div>
                </div>
                `
                    : ""
                }
            </div>
        </div>

        <div class="urgent">
            <h3>⚡ Action Required</h3>
            <p>Please ensure the meeting room is prepared and available for the scheduled time.</p>
            <p><strong>Booking Type:</strong> ${
              bookingDetails.isFullDay ? "Full Day" : "Time Slot"
            }</p>
        </div>

        <p><em>This is an automated notification from the Coworking Cube booking system.</em></p>
    </div>
</body>
</html>`;

export const REGISTRATION_CONFIRMATION_TEMPLATE = (user: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Coworking Cube</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f8fafc;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #e2e8f0;
        }
        .welcome-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #3b82f6;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .detail-label {
            font-weight: 600;
            color: #64748b;
        }
        .detail-value {
            font-weight: 600;
            color: #1e293b;
        }
        .features {
            background: #eff6ff;
            border: 1px solid #dbeafe;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
        .company-name {
            color: #3b82f6;
            font-weight: bold;
            font-size: 18px;
        }
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #f97316, #ea580c);
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎉 Welcome to Coworking Cube!</h1>
        <p>Your account has been successfully created</p>
    </div>
    
    <div class="content">
        <p>Dear <strong>${user.name}</strong>,</p>
        
        <p>Welcome to Coworking Cube! We're excited to have you on board and look forward to helping you find the perfect meeting spaces for your needs.</p>
        
        <div class="welcome-section">
            <h3>Your Account Details</h3>
            <div class="detail-row">
                <span class="detail-label">Full Name:</span>
                <span class="detail-value">${user.name}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${user.email}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Company:</span>
                <span class="detail-value">${user.companyName}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">Account Type:</span>
                <span class="detail-value">Standard Account</span>
            </div>
        </div>

        <div class="features">
            <h3>🚀 What You Can Do Now:</h3>
            <ul>
                <li>Book meeting rooms at our Kottawa & Mirissa branches</li>
                <li>Manage your bookings through your dashboard</li>
                <li>Track your company's booking hours</li>
                <li>Receive instant booking confirmations</li>
                <li>Modify or cancel bookings as needed</li>
            </ul>
        </div>

        <div style="text-align: center;">
            <a href="${
              process.env.NEXT_PUBLIC_API_BASE_URL || "https://yourdomain.com"
            }" class="cta-button">
                Start Booking Now
            </a>
        </div>

        <p><strong>Need Help?</strong></p>
        <ul>
            <li>Check out our FAQ section for common questions</li>
            <li>Contact our support team for assistance</li>
            <li>Visit our branches for a personal tour</li>
        </ul>

        <div class="footer">
            <p>Thank you for choosing <span class="company-name">Coworking Cube</span></p>
            <p>📍 Kottawa & Mirissa Branches</p>
            <p>📞 Contact: +94 XX XXX XXXX | ✉️ support@coworkingcube.com</p>
        </div>
    </div>
</body>
</html>`;

export const REGISTRATION_NOTIFICATION_TEMPLATE = (user: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New User Registration</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #8b5cf6, #7c3aed);
            color: white;
            padding: 25px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #faf5ff;
            padding: 25px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #ddd6fe;
        }
        .user-info {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 15px 0;
            border-left: 4px solid #8b5cf6;
        }
        .info-section {
            margin-bottom: 15px;
            padding: 12px;
            background: #f8fafc;
            border-radius: 6px;
        }
        .detail-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 10px;
        }
        .detail-item {
            padding: 8px;
            border-bottom: 1px solid #e2e8f0;
        }
        .label {
            font-weight: 600;
            color: #475569;
            font-size: 14px;
        }
        .value {
            font-weight: 600;
            color: #1e293b;
        }
        .timestamp {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            padding: 10px;
            border-radius: 6px;
            text-align: center;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>👤 New User Registration</h1>
        <p>A new user has registered on Coworking Cube</p>
    </div>
    
    <div class="content">
        <div class="info-section">
            <h3>User Information</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <div class="label">Full Name:</div>
                    <div class="value">${user.name}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Email:</div>
                    <div class="value">${user.email}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Company:</div>
                    <div class="value">${user.companyName}</div>
                </div>
                <div class="detail-item">
                    <div class="label">Phone Number:</div>
                    <div class="value">${user.phoneNumber}</div>
                </div>
            </div>
        </div>

        <div class="timestamp">
            <strong>Registration Date:</strong> ${new Date().toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}
        </div>

        <div style="background: #fef3c7; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px;">
            <h3>📊 System Update</h3>
            <p><strong>Total Users:</strong> [Automated count would go here]</p>
            <p><strong>Action:</strong> New user account requires no additional setup</p>
        </div>

        <p><em>This is an automated notification from the Coworking Cube registration system.</em></p>
    </div>
</body>
</html>`;

export const PASSWORD_RESET_OTP_TEMPLATE = (user: any, otp: string) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset OTP</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #dc2626, #b91c1c);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #fef2f2;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #fecaca;
        }
        .otp-container {
            background: white;
            padding: 25px;
            border-radius: 8px;
            margin: 20px 0;
            text-align: center;
            border: 2px dashed #dc2626;
        }
        .otp-code {
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            color: #dc2626;
            margin: 15px 0;
        }
        .security-note {
            background: #fef3c7;
            border: 1px solid #fcd34d;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
        .company-name {
            color: #dc2626;
            font-weight: bold;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🔒 Password Reset Request</h1>
        <p>Use this code to reset your password</p>
    </div>
    
    <div class="content">
        <p>Dear <strong>${user.name}</strong>,</p>
        
        <p>We received a request to reset your password for your Coworking Cube account. Use the verification code below to proceed with resetting your password.</p>
        
        <div class="otp-container">
            <h3>Your Verification Code</h3>
            <div class="otp-code">${otp}</div>
            <p>This code will expire in 10 minutes</p>
        </div>

        <div class="security-note">
            <h3>⚠️ Security Notice</h3>
            <p>If you didn't request this password reset, please ignore this email. Your account security is important to us.</p>
        </div>

        <p><strong>Need Help?</strong></p>
        <ul>
            <li>This code is valid for 10 minutes only</li>
            <li>Do not share this code with anyone</li>
            <li>Contact support if you need assistance</li>
        </ul>

        <div class="footer">
            <p>Thank you for choosing <span class="company-name">Coworking Cube</span></p>
            <p>📍 Kottawa & Mirissa Branches</p>
            <p>📞 Contact: +94 XX XXX XXXX | ✉️ support@coworkingcube.com</p>
        </div>
    </div>
</body>
</html>`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = (user: any) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Password Reset Successful</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: linear-gradient(135deg, #059669, #047857);
            color: white;
            padding: 30px;
            text-align: center;
            border-radius: 10px 10px 0 0;
        }
        .content {
            background: #f0fdf4;
            padding: 30px;
            border-radius: 0 0 10px 10px;
            border: 1px solid #bbf7d0;
        }
        .success-section {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #059669;
        }
        .security-tips {
            background: #fffbeb;
            border: 1px solid #fed7aa;
            padding: 15px;
            border-radius: 8px;
            margin: 15px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
            color: #64748b;
            font-size: 14px;
        }
        .company-name {
            color: #059669;
            font-weight: bold;
            font-size: 18px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>✅ Password Reset Successful</h1>
        <p>Your password has been updated successfully</p>
    </div>
    
    <div class="content">
        <p>Dear <strong>${user.name}</strong>,</p>
        
        <p>Your Coworking Cube account password has been successfully reset. You can now log in to your account using your new password.</p>
        
        <div class="success-section">
            <h3>Account Security Update</h3>
            <p><strong>Password Changed:</strong> ${new Date().toLocaleDateString(
              "en-US",
              {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }
            )}</p>
            <p><strong>Account:</strong> ${user.email}</p>
        </div>

        <div class="security-tips">
            <h3>🔒 Security Tips</h3>
            <ul>
                <li>Use a strong, unique password</li>
                <li>Never share your password with anyone</li>
                <li>Log out from shared devices</li>
                <li>Enable two-factor authentication if available</li>
            </ul>
        </div>

        <div style="text-align: center; margin: 20px 0;">
            <a href="${
              process.env.NEXT_PUBLIC_API_BASE_URL || "https://yourdomain.com"
            }/auth/login" 
               style="display: inline-block; background: linear-gradient(135deg, #059669, #047857); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                Log In to Your Account
            </a>
        </div>

        <div class="footer">
            <p>Thank you for choosing <span class="company-name">Coworking Cube</span></p>
            <p>📍 Kottawa & Mirissa Branches</p>
            <p>📞 Contact: +94 XX XXX XXXX | ✉️ support@coworkingcube.com</p>
        </div>
    </div>
</body>
</html>`;
