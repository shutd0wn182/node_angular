var nodemailer = require('nodemailer');

var Tools = function(){
    this.transporter = nodemailer.createTransport('smtps://masterrandrew%40gmail.com:Blink182182@smtp.gmail.com');
};

Tools.prototype.sendMail = function (_user_email, _subject, _text, _html) {
    var mailOptions = {
        from: '"WatchHelperApp" <nodemail@tester.com>',
        to: _user_email,
        subject: _subject,
        text: _text,
        html: _html
    };

    this.transporter.sendMail(mailOptions, function(error, info){
        if(error){
            return console.log(error);
        }

        console.log('Message sent: ' + info.response);
    });
};

module.exports = Tools;