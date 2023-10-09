import { getPartners } from "../../getpartners";
const timeouts = {};

const cancelEmail = (token) => {

  // E-posta gönderme işlemini iptal etmek için mevcut zamanlayıcıyı temizleyin
  if (timeouts[token]) {
    clearTimeout(timeouts[token]);
    delete timeouts[token];
  }
};

const startEmailSendProcess = (res, emailData) => {
  handleEmailData(emailData, timeouts);
  return res.status(200).json({ message: 'E-mail gönderme işlemi başladı.' });
}

const handleEmailData = async (emailData) => {

  const token = emailData.token;

  // E-posta gönderme işlemini iptal etmek için mevcut zamanlayıcıyı temizleyin
  if (timeouts[token]) {
    clearTimeout(timeouts[token]);
  }

  return new Promise(async (resolve, reject) => {
    // E-posta gönderme işlemini 1 dakika içinde iptal etmek için zamanlayıcı ayarlayın
    // setTimeout(() => {cancelEmail(timeouts,token)}, 1 * 10 * 1000); // 1 dakika

    timeouts[token] = setTimeout(async () => {
      // 1 dakika içinde tüm e-postalar gönderilmezse, gönderimleri iptal edin
      console.log('mail gönderme başlıyor')
      try {
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
        const nodemailer = require("nodemailer");

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

        if (filteredPartnerData.length > 0) {
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
                  reject(err);
                } else {
                  resolve(info.response);
                }
              });
            });
            sendEmailPromises.push(sendPromise);
          };
        }

        if (emailData.optionalPartnerEmails.length > 0) {
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
                  reject(err);
                } else {
                  console.log(`Email sent to ${email}: ${info.response}`);
                  resolve(info.response);
                }
              });
            });
            sendEmailPromises.push(sendPromise);
          };
        }


        // Tüm e-posta gönderimlerini bekleyin
        try {
          if (sendEmailPromises.length === 0) {
            reject('No emails sent.');
            return;
          }
          const sendResults = await Promise.all(sendEmailPromises);
          resolve(sendResults);

        }
        catch (error) {
          reject(error);
        }

      } catch (error) {
        reject(error);

      }
      delete timeouts[token];
    }, 1 * 20 * 1000); // 1 dakika

  });
}
export default async function handler(req, res) {
  try {

    const emailData = req.body;
    emailData.token="123456789";

    if (emailData.status === 'Canceled') {

      cancelEmail(emailData.token);
      res.status(200).json({ message: 'Email sending canceled.' });
    }
    else {
      startEmailSendProcess(res, emailData);

    }

  } catch (error) {
    console.error('handler', error);
    res.status(500).json({ error });
  }
}


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
