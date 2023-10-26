import { Resend } from 'resend';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method Not Allowed' });
    }
  
    const { coupon, email, cc } = req.body;
  
    const resend = new Resend(process.env.RESEND_API_KEY);
  
    const emailOptions = {
      from: "CDRCloud Promosyon <coupon@order.k2msoftware.com>",
      to: email,
      subject: 'Promosyon Kodu',
      html: `<div style="font-family: Arial, sans-serif; text-align: center; background-color: #f5f5f5; padding: 20px;">
        <h1 style="color: #333;">Promosyon Kodu</h1>
        <p style="color: #666;">1 yıllık ücretsiz kullanım için <a href="https://www.CDRCloud.com">CDRCloud.com</a>'da kullanabileceğiniz kupon kodunuz:</p>
        <div style="background-color: #fff; border: 1px solid #ddd; padding: 10px; display: inline-block;">
          <p style="font-size: 18px; color: #333; font-weight: bold; margin: 0;">${coupon}</p>
        </div>
      </div>`,
    };
  
    if (cc && cc.trim() !== '') {
      emailOptions.cc = cc;
    }
  
    // Send email using the resend module
    await resend.emails.send(emailOptions);
  
    // Return success response
    return res.status(200).json({ success: true });
  }