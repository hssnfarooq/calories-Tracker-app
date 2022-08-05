const nodemailer = require("nodemailer");

const genPassword = () => {
  let stringInclude = "";
  stringInclude += "!\"#$%&'()*+,-./:;<=>?@[]^_`{|}~";
  stringInclude += "0123456789";
  stringInclude += "abcdefghijklmnopqrstuvwxyz";
  stringInclude += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let password = "";
  for (let i = 0; i < 20; i++) {
    password += stringInclude.charAt(
      Math.floor(Math.random() * stringInclude.length)
    );
  }
  return password;
};
const emailService = async (detail) => {
  var transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USERNAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  let mailData = `<b>Hello ${detail.username}</b><br>
  please use the credentials for login <br>
  email: ${detail.email}<br>
  password: ${detail.password}<br>
  website: ${process.env.APP_URL}
  `;
  await transport.sendMail({
    from: '"Admin" <user@calories-app.com>',
    to: detail.email,
    subject: "Calories App Invitation", // Subject line
    html: mailData,
  });
};
module.exports = { genPassword, emailService };
