import { getPartners } from "../../getpartners";

export default async function handler(req, res) {
  try {

    const emailData = await req.body;

    //const partners = await getPartners();
    const partners = [
      {
        PartnerId: '205522',
        CompanyName: 'Bilisim Bilgisayar Ltd.Sti.',
        PartnerLevelName: 'Bronze Partner',
        Email: 'ibrahimak@gmail.com'
      },
     
      {
        PartnerId: '219991',
        CompanyName: 'Pro-Sistem Bilgisayar',
        PartnerLevelName: 'Gold Partner',
        Email: 'esra@k2mbilisim.com'
      },
      {
        PartnerId: '227218',
        CompanyName: 'VODACOM İLETİŞİM HİZMETLERİ SAN.ve TİC. LTD.ŞTİ.',
        PartnerLevelName: 'Silver Partner',
        Email: 'mustafa@k2mbilisim.com'
      }]

    console.log(partners)
    console.log(partners.length)
    const filteredPartnerData = partners.filter(partner => partner.PartnerLevelName.includes(emailData.selectedPartner));

    for (const partner of filteredPartnerData) {
      console.log(partner.CompanyName);
    }

    // const countsByPartnerLevel = {};

    // Loop through the partnerData and count by PartnerLevelName
    // partners.forEach(partner => {
    //   const { PartnerLevelName } = partner;
    //   if (countsByPartnerLevel[PartnerLevelName]) {
    //     countsByPartnerLevel[PartnerLevelName]++;
    //   } else {
    //     countsByPartnerLevel[PartnerLevelName] = 1;
    //   }
    // });

    // Log the counts to the console
    // console.log('Counts by PartnerLevelName:', countsByPartnerLevel);

    if (filteredPartnerData.length === 0) {
      throw new Error('No matching partners found.');
    }

    const nodemailer = require("nodemailer");

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

      const sendEmailPromises = filteredPartnerData.map(partner => {
        const mailData = {
          from: 'K2M Bilişim Bilgilendirme <info@k2mbilisim.com>',
          to: partner.Email,
          subject: emailData.title,
          text: "",
          html: emailData.content
        };

        return new Promise((resolve, reject) => {
          transporter.sendMail(mailData, function (err, info) {
            if (err) {
              console.error(`Error sending email to ${partner.CompanyName}: ${err.message}`);
              reject(err);
            } else {
              console.log(`Email sent to ${partner.CompanyName}: ${info.response}`);
              resolve(info.response);
            }
          });
        });
      });

      try {
        const sendResults = await Promise.all(sendEmailPromises);
        console.log('All emails sent successfully.');
        res.status(200).json({ success: 'All emails sent successfully.', sendResults });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
      }
    } else {
      res.status(405).json({ error: "Method is not allowed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}
