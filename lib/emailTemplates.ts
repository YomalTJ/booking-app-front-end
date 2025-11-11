export const BOOKING_CONFIRMATION_TEMPLATE = (
  bookingDetails: any,
  user: any
) => `
<html>
<head>
   <meta content="text/html; charset=UTF-8" http-equiv="content-type">
   <style type="text/css">
     .para{color:#000;text-decoration:none;vertical-align:baseline;font-size:9pt;font-family:"Arial";font-style:normal}
     h1{padding-top:24pt;color:#000000;font-weight:700;font-size:24pt;padding-bottom:6pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}
     p{margin:0;color:#000000;font-size:11pt;font-family:"Arial"}
     .line{height:2px;border-width:0;color:#0797cb;background-color:#0797cb}
     .c0{padding-top:0pt;padding-bottom:5pt;line-height:1.15;text-align:left}
     .c1{color:#000;font-weight:700;text-decoration:none;vertical-align:baseline;font-size:9pt;font-family:"Arial";font-style:normal}
     .c4{color:#000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:9pt;font-family:"Arial";font-style:normal}
 </style>
</head>
<body class="">
  <div style="background-color:#ffffff;max-width:468pt">
     <div style="margin: 0; padding: 0; display: flex; flex-direction: row; align-items: center; justify-content: space-between;">
       <div style="margin: 0; padding: 0;">
         <p style="margin: 0 0 10px; padding: 0; font-size: 18px; font-weight: bold;">Booking Confirmation</p>
         <p style="margin: 0 0 10px; padding: 0;">Dear ${user.name}, your booking has been confirmed.</p>
         <br>
       </div>
     </div>
     <hr style="margin: 20px 0; padding: 0; border: 0; border-top: 3px solid #376AD9;">

     <table style="width: 100%;">
        <tr>
          <td style="width:50%">
            <p style="margin: 0 0 10px; padding: 0; font-weight: bold;">Room:</p>
            <p style="margin: 0; padding: 0;">${bookingDetails.roomName}</p>
          </td>
          <td></td>
          <td>
            <p style="margin: 0 0 10px; padding: 0; font-weight: bold;">Date:</p>
            <p style="margin: 0 0 10px; padding: 0;">${bookingDetails.date}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin: 0 0 10px; padding: 0; font-weight: bold;">Time Slot:</p>
            <p style="margin: 0; padding: 0;">${bookingDetails.timeSlot}</p>
          </td>
          <td></td>
          <td>
            <p style="margin: 0; padding: 0; font-weight: bold;">Duration:</p>
            <p style="margin: 0; padding: 0;">${bookingDetails.duration}</p>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <p style="margin: 20px 0 10px; padding: 0; font-weight: bold;">Booking Reference:</p>
            <p style="margin: 0; padding: 0; font-size: 16px; color: #376AD9;">${bookingDetails.bookingId}</p>
          </td>
        </tr>
      </table>
      <br>
      <p class="c0"><span class="c4">Thank you for choosing our coworking space!</span></p>
      <p class="c0"><span class="c1">Coworking Cube Team</span></p>
   </div>
</body>
</html>`;

export const BOOKING_NOTIFICATION_TEMPLATE = (
  bookingDetails: any,
  user: any
) => `
<html>
<head>
   <meta content="text/html; charset=UTF-8" http-equiv="content-type">
   <style type="text/css">
     .para{color:#000;text-decoration:none;vertical-align:baseline;font-size:9pt;font-family:"Arial";font-style:normal}
     h1{padding-top:24pt;color:#000000;font-weight:700;font-size:24pt;padding-bottom:6pt;font-family:"Arial";line-height:1.15;page-break-after:avoid;orphans:2;widows:2;text-align:left}
     p{margin:0;color:#000000;font-size:11pt;font-family:"Arial"}
     .line{height:2px;border-width:0;color:#0797cb;background-color:#0797cb}
     .c0{padding-top:0pt;padding-bottom:5pt;line-height:1.15;text-align:left}
     .c1{color:#000;font-weight:700;text-decoration:none;vertical-align:baseline;font-size:9pt;font-family:"Arial";font-style:normal}
     .c4{color:#000;font-weight:400;text-decoration:none;vertical-align:baseline;font-size:9pt;font-family:"Arial";font-style:normal}
 </style>
</head>
<body class="">
  <div style="background-color:#ffffff;max-width:468pt">
     <div style="margin: 0; padding: 0;">
       <p style="margin: 0 0 10px; padding: 0; font-size: 18px; font-weight: bold;">New Booking Notification</p>
       <p style="margin: 0 0 10px; padding: 0;">A new booking has been created in the system.</p>
     </div>
     <hr style="margin: 20px 0; padding: 0; border: 0; border-top: 3px solid #376AD9;">

     <table style="width: 100%;">
        <tr>
          <td style="width:50%">
            <p style="margin: 0 0 10px; padding: 0; font-weight: bold;">User:</p>
            <p style="margin: 0; padding: 0;">${user.name}</p>
            <p style="margin: 0; padding: 0;">${user.email}</p>
          </td>
          <td></td>
          <td>
            <p style="margin: 0 0 10px; padding: 0; font-weight: bold;">Company:</p>
            <p style="margin: 0 0 10px; padding: 0;">${user.companyName}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin: 0 0 10px; padding: 0; font-weight: bold;">Room:</p>
            <p style="margin: 0; padding: 0;">${bookingDetails.roomName}</p>
          </td>
          <td></td>
          <td>
            <p style="margin: 0 0 10px; padding: 0; font-weight: bold;">Date:</p>
            <p style="margin: 0 0 10px; padding: 0;">${bookingDetails.date}</p>
          </td>
        </tr>
        <tr>
          <td>
            <p style="margin: 0 0 10px; padding: 0; font-weight: bold;">Time Slot:</p>
            <p style="margin: 0; padding: 0;">${bookingDetails.timeSlot}</p>
          </td>
          <td></td>
          <td>
            <p style="margin: 0; padding: 0; font-weight: bold;">Duration:</p>
            <p style="margin: 0; padding: 0;">${bookingDetails.duration}</p>
          </td>
        </tr>
        <tr>
          <td colspan="3">
            <p style="margin: 20px 0 10px; padding: 0; font-weight: bold;">Booking Reference:</p>
            <p style="margin: 0; padding: 0; font-size: 16px; color: #376AD9;">${bookingDetails.bookingId}</p>
          </td>
        </tr>
      </table>
   </div>
</body>
</html>`;
