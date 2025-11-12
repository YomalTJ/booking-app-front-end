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
