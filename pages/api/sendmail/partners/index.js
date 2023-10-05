import { getPartners } from "../../getpartners";

export default async function handler(req, res) {
  try {

    const emailData = await req.body;
    console.log(emailData);
    //const partners = await getPartners();

    const partners = [
      {
        PartnerId: '205522',
        ContactName: 'İbrahim AKGÜN',
        CompanyName: 'Bilisim Bilgisayar Ltd.Sti.',
        PartnerLevelName: 'Bronze Partner',
        Email: 'ibrahimak@gmail.com'
      },

      {
        PartnerId: '219991',
        ContactName: 'Esra AYBEK',
        CompanyName: 'Pro-Sistem Bilgisayar',
        PartnerLevelName: 'Gold Partner',
        Email: 'esra@k2mbilisim.com'
      },
      {
        PartnerId: '227218',
        ContactName: 'Mustafa GÖZTÜR',
        CompanyName: 'VODACOM İLETİŞİM HİZMETLERİ SAN.ve TİC. LTD.ŞTİ.',
        PartnerLevelName: 'Silver Partner',
        Email: 'mustafa@k2mbilisim.com'
      },
      {
        PartnerId: '219991',
        ContactName: 'Emre Dikici',
        CompanyName: 'Pro-System',
        PartnerLevelName: 'Platinium Partner',
        Email: 'emre@k2mbilisim.com'
      },
      {
        PartnerId: '219991',
        ContactName: 'Recep Karabacak',
        CompanyName: 'K2M Bilişim',
        PartnerLevelName: 'Titanium Partner',
        Email: 'recep@k2mbilisim.com'
      },
    ]

    const selectedPartners = emailData.selectedPartner.map(item => item.label);

    const filteredPartnerData = partners.filter(partner => selectedPartners.some(label => partner.PartnerLevelName.includes(label)));

    // console.log(filteredPartnerData);

    // for (const partner of filteredPartnerData) {
    //   console.log(partner.CompanyName);
    // }

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

    if (filteredPartnerData.length === 0 && emailData.optionalPartnerEmails.length === 0) {
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

      const sendEmailPromises = [];

      // filteredPartnerData içindeki partnerlere e-posta gönderin
      for (const partner of filteredPartnerData) {
        const mailData = {
          from: 'K2M Bilişim Bilgilendirme <info@k2mbilisim.com>',
          to: partner.Email,
          subject: emailData.title,
          text: "",
          html: emailData.content.replace('#CONTACT_NAME#', partner.ContactName).replace('#PARTNER_NAME#', partner.CompanyName)
        };

        const sendPromise = new Promise((resolve, reject) => {
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

        sendEmailPromises.push(sendPromise);
      }

      // optionalPartnerEmails içindeki e-posta adreslerine de e-posta gönderin
      for (const email of emailData.optionalPartnerEmails) {
        const mailData = {
          from: 'K2M Bilişim Bilgilendirme <info@k2mbilisim.com>',
          to: email,
          subject: emailData.title,
          text: "",
          html: emailData.content.replace('#CONTACT_NAME#', 'Yetkili').replace('#PARTNER_NAME#', 'Yetkili')
        };

        const sendPromise = new Promise((resolve, reject) => {
          transporter.sendMail(mailData, function (err, info) {
            if (err) {
              console.error(`Error sending email to ${email}: ${err.message}`);
              reject(err);
            } else {
              console.log(`Email sent to ${email}: ${info.response}`);
              resolve(info.response);
            }
          });
        });

        sendEmailPromises.push(sendPromise);
      };

      // Tüm e-posta gönderimlerini bekleyin
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

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
