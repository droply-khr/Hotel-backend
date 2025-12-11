const nodemailer = require('nodemailer');

// Create transporter (using Hostinger SMTP)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.hostinger.com',
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER || 'booking@kashmirilodges.pk',
      pass: process.env.EMAIL_PASSWORD || 'your-email-password'
    }
  });
};

// Send booking confirmation email
exports.sendBookingEmail = async (req, res) => {
  try {
    const bookingData = JSON.parse(req.body.bookingData);
    const paymentProof = req.file;

    // Create email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: #3a3a3a; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; color: #d4af37;">🏔️ New Booking Received</h1>
          <p style="margin: 10px 0 0 0; color: #e0e0e0;">Kashmiri Lodges</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #3a3a3a; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Booking Details</h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Booking ID:</strong> ${bookingData.id}</p>
            <p style="margin: 10px 0;"><strong>Guest Name:</strong> ${bookingData.guestName}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${bookingData.email}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${bookingData.phone}</p>
          </div>

          <h3 style="color: #3a3a3a; margin-top: 25px;">Stay Information</h3>
          <div style="margin: 15px 0;">
            <p style="margin: 10px 0;"><strong>Check-in:</strong> ${bookingData.checkIn}</p>
            <p style="margin: 10px 0;"><strong>Check-out:</strong> ${bookingData.checkOut}</p>
            <p style="margin: 10px 0;"><strong>Total Guests:</strong> ${bookingData.totalGuests || 'N/A'}</p>
          </div>

          <h3 style="color: #3a3a3a; margin-top: 25px;">Rooms Booked</h3>
          <ul style="list-style: none; padding: 0;">
            ${bookingData.rooms.map(room => `
              <li style="background-color: #f9f9f9; padding: 10px; margin: 5px 0; border-left: 3px solid #d4af37;">
                ${room.name} x ${room.quantity}
              </li>
            `).join('')}
          </ul>

          <h3 style="color: #3a3a3a; margin-top: 25px;">Payment Information</h3>
          <div style="background-color: #f0f8ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
            ${bookingData.originalAmount ? `
              <p style="margin: 5px 0;"><strong>Original Amount:</strong> PKR ${bookingData.originalAmount.toLocaleString()}</p>
              <p style="margin: 5px 0; color: #22c55e;"><strong>Discount:</strong> - PKR ${bookingData.discountAmount?.toLocaleString()}</p>
              <p style="margin: 5px 0; color: #f59e0b;"><strong>Offer Applied:</strong> ${bookingData.appliedOffer}</p>
            ` : ''}
            ${bookingData.includesBreakfast ? `
              <p style="margin: 5px 0;"><strong>Breakfast:</strong> Included ${bookingData.breakfastCharges ? `(PKR ${bookingData.breakfastCharges})` : '(Free with offer)'}</p>
            ` : ''}
            <p style="margin: 5px 0; font-size: 18px;"><strong>Total Amount:</strong> <span style="color: #d4af37;">PKR ${bookingData.totalAmount.toLocaleString()}</span></p>
            ${bookingData.paymentType === 'partial' ? `
              <p style="margin: 5px 0; color: #22c55e;"><strong>Amount Paid:</strong> PKR ${bookingData.amountPaid?.toLocaleString()}</p>
              <p style="margin: 5px 0; color: #f59e0b;"><strong>Remaining Amount:</strong> PKR ${bookingData.remainingAmount?.toLocaleString()}</p>
            ` : ''}
            <p style="margin: 5px 0;"><strong>Payment Method:</strong> ${bookingData.paymentMethod?.toUpperCase() || 'N/A'}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> <span style="padding: 3px 8px; background-color: ${bookingData.status === 'paid' ? '#22c55e' : '#f59e0b'}; color: white; border-radius: 3px;">${bookingData.status.toUpperCase()}</span></p>
          </div>

          ${bookingData.guestInfo?.specialRequests ? `
            <h3 style="color: #3a3a3a; margin-top: 25px;">Special Requests</h3>
            <p style="background-color: #fffbeb; padding: 15px; border-left: 3px solid #f59e0b; margin: 10px 0;">
              ${bookingData.guestInfo.specialRequests}
            </p>
          ` : ''}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666;">
            <p style="margin: 5px 0;">Booking created at: ${new Date(bookingData.createdAt).toLocaleString()}</p>
            <p style="margin: 5px 0;">Kashmiri Lodges - Where Mountains Meet Luxury</p>
          </div>
        </div>
      </div>
    `;

    // Prepare email options
    const mailOptions = {
      from: process.env.EMAIL_USER || 'your-email@gmail.com',
      to: process.env.ADMIN_EMAIL || 'admin@kashmirilodges.com',
      subject: `🏨 New Booking - ${bookingData.guestName} - ${bookingData.id}`,
      html: emailContent,
      attachments: []
    };

    // Add payment proof as attachment if exists
    if (paymentProof) {
      mailOptions.attachments.push({
        filename: `payment-proof-${bookingData.id}.${paymentProof.mimetype.split('/')[1]}`,
        content: paymentProof.buffer,
        contentType: paymentProof.mimetype
      });
    }

    // Send email
    const transporter = createTransporter();
    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: 'Booking email sent successfully'
    });

  } catch (error) {
    console.error('Error sending booking email:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send booking email',
      error: error.message
    });
  }
};
