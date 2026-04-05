const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    secure: false,
    auth: {
        user: "e614a3ed848e53",
        pass: "e77d579f44b9ae",
    },
});

module.exports = {
    sendMail: async function (to, url) {
        await transporter.sendMail({
            from: "admin@haha.com",
            to: to,
            subject: "reset password email",
            text: "click vao day de doi pass",
            html: 'click vao <a href="' + url + '">day</a> de doi pass',
        });
    },
};
