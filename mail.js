const sgMail = require('@sendgrid/mail');
require('dotenv').config();
const sendGridApiKey = process.env.SENDGRID_API_KEY;
sgMail.setApiKey(sendGridApiKey);




function sendOtp(email, otp) {
    const sendEmail = async () => {
        const msg = {
            to: email,
            from: 'sehrozkhan2704@gmail.com', // Your verified SendGrid sender email
            subject: 'subject',
            text: otp,
            html: otp,
        };

        try {
            await sgMail.send(msg);
            console.log('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            if (error.response) {
                console.error(error.response.body);
            }
        }
    };

    sendEmail();
}


sendOtp('fareehachoglay29@gmail.com', 'faree tu kamini hai ');

exports.sendOtp = sendOtp;
