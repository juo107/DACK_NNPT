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

function escapeHtml(s) {
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

module.exports = {
    /** Gửi mật khẩu mới (plain text) sau khi user dùng quên mật khẩu */
    sendMail: async function (to, newPassword) {
        const safe = escapeHtml(newPassword);
        await transporter.sendMail({
            from: "admin@haha.com",
            to: to,
            subject: "Mat khau moi - NNPT",
            text: `Mat khau moi cua ban la: ${newPassword}. Vui long dang nhap va doi mat khau neu can.`,
            html:
                "<p>Mật khẩu mới của bạn: <strong>" +
                safe +
                "</strong></p><p>Vui lòng đăng nhập và đổi mật khẩu trong trang cá nhân nếu cần.</p>",
        });
    },
};
