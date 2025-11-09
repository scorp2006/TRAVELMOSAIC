import emailjs from '@emailjs/browser';

// EmailJS Configuration
// Get these from: https://dashboard.emailjs.com/
const EMAILJS_SERVICE_ID = 'service_qd31ben';
const EMAILJS_TEMPLATE_ID = 'template_fpwxa24';
const EMAILJS_PUBLIC_KEY = '19NRa08ZgwV5QyU_-';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface InvitationEmail {
  toEmail: string;
  toName: string;
  fromName: string;
  tripName: string;
  tripLink: string;
  message?: string;
}

export async function sendTripInvitation(data: InvitationEmail): Promise<boolean> {
  // Check if EmailJS is configured
  if (
    EMAILJS_SERVICE_ID === 'YOUR_SERVICE_ID' ||
    EMAILJS_TEMPLATE_ID === 'YOUR_TEMPLATE_ID' ||
    EMAILJS_PUBLIC_KEY === 'YOUR_PUBLIC_KEY'
  ) {
    console.warn('EmailJS not configured. Skipping email send.');
    console.log('Invitation would be sent to:', data.toEmail);
    // Return true to simulate success in development
    return true;
  }

  try {
    const templateParams = {
      to_email: data.toEmail,
      to_name: data.toName,
      from_name: data.fromName,
      trip_name: data.tripName,
      trip_link: data.tripLink,
      message: data.message || `You've been invited to collaborate on a trip!`,
    };

    const response = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('Email sent successfully:', response);
    return response.status === 200;
  } catch (error) {
    console.error('Failed to send email:', error);
    throw new Error('Failed to send invitation email');
  }
}
