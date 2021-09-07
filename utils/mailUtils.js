var nodemailer = require('nodemailer');

class MailUtils {
    sendMail(mailOptions) {
        //Sending Mail
        var transporter = nodemailer.createTransport({
            service: 'gmail'
            , auth: { user:  process.env.GMAIL_EMAIL, pass: process.env.GMAIL_PASSWORD }
        });
        transporter.sendMail(mailOptions, function (err) {
            if (err) {
                return false
            }
            return true;
        });
    }
}

module.exports = MailUtils;