import { getPartners } from "../../getpartners";

  export default async function handler(req, res) {
    try {

       const emailData = await req.body;

      const partners = await getPartners();

      let nodemailer = require("nodemailer");
  
      if (req.method === "POST") {
        const transporter = nodemailer.createTransport({
          port: 587,
          host: "mail.buluttel.com",
          auth: {
            user: "info@k2mbilisim.com",
            pass: process.env.NEXT_PUBLIC_MAILPASS,
          },
          ignoreTLS: false,
          requireTLS: true,
        });
  
          let mailData = {
            from: "info@k2mbilisim.com",
            to: emailData.address,
            subject: emailData.title,
            text: "",
            html: emailData.content
          };
  
          transporter.sendMail(mailData, function (err, info) {
            console.log(info)
            if (err) console.log(err);
          });
     
        res.status(200).end();
      } else {
        res.json({ error: "Method is not allowed" });
        res.status(404).end();
      }
    } catch (error) {
      console.log(error)
      res.status(500).json(error);
    }
  }
  