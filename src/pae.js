const nodemailer = require('nodemailer');
require('dotenv').config();

// Step 1
let transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    ssl: process.env.TYPEORM_DRIVER_EXTRA,
    auth: {
        user: process.env.MAIL_THY,
        pass: process.env.PW_THY
    }
});

// Step 2
let mailOptions = {
    from: process.env.MAIL_THY,
    to: [process.env.MAIL_RDU, process.env.MAIL_DHE],
    cc: [process.env.MAIL_ATH],
    subject: process.env.SJ_SERIOUS,
    text: process.env.T_02 +
          process.env.T_GH_PUP +
          process.env.URL_GH_PUP +
          process.env.T_SERIOUS
};

// Step 3
transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
        console.log(error);
    } else {
        console.log('Email Send:'+info.response);
    }
});