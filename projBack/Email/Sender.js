/** @format */

var nodemailer = require("nodemailer");

const dotenv = require("dotenv");
dotenv.config();

var transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_SENDER,
    pass: process.env.SENDER_PASSWORD,
  },
});

const signupmail = (email, name) => {
  var mail = {
    from: "projectbyguruji@gmail.com",
    to: email,
    subject: `Thank you chooseing us!! Hope you have good time 😃`,
    text: `Hope you have good time while useing our application!.
            Once agine chooseing us ${name}
            `,
  };

  transport.sendMail(mail, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
};

const exitmail = (email, name) => {
  var mail = {
    from: "projectbyguruji@gmail.com",
    to: email,
    subject: `Thank you being with us for this long!! 🙁`,
    text: `As you desied to leave us. We hope us we agine onboard Soon ${name}`,
  };

  transport.sendMail(mail, (err, res) => {
    if (err) {
      console.log(err);
    }
  });
};

module.exports = { signupmail, exitmail };
