const MailUtils = require('../../mailUtils');


module.exports = function (check,notifyData) { 
    var mailUtils = new MailUtils();

    var isUPstr = notifyData.isUP ? "Up" : "Down";
    var mailOptions = {
        from: 'no-reply@BostaApp.com'
        , to: notifyData.user.email
        , subject: 'Bosta check notification'
        , text: 'Hello,\n\n' + check.name + ' check is ' + isUPstr +" "+ notifyData.requestURL + '.\n'
    };

    mailUtils.sendMail(mailOptions);

};