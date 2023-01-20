export default async function handler(req, res) {
  try {
    let nodemailer = require("nodemailer");
    if (req.method === "POST") {
      const data = await req.body;

      console.log(data);

      const transporter = nodemailer.createTransport({
        port: 587,
        host: "mail.buluttel.com",
        auth: {
          user: "order@k2msoftware.com",
          pass: process.env.NEXT_PUBLIC_MAILPASS,
        },
        ignoreTLS: false,
        requireTLS: true,
      });

      const mailData = {
        from: "order@k2msoftware.com",
        to: "ibrahim@iakgun.dev",
        subject: `Deneme`,
        text: "Test mailidir",
        html: `<div><h1>${"HTML testi"}</h1></div>`,
      };

      transporter.sendMail(mailData, function (err, info) {
        if (err) console.log(err)
      });
      res.status(200).end()
    } else {
      res.json({ error: "Method is not allowed" });
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
