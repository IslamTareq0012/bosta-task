var nodemailer = require('nodemailer');

class MailUtils {
    sendMail(mailOptions) {
        //Sending Mail
        var transporter = nodemailer.createTransport({
            service: 'gmail'
            , auth: { user: "islamwoow@gmail.com", pass: "123456789&@" }
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