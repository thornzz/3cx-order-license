import { Resend } from 'resend';
import {
  collection,
  getDocs,
  query,
} from "firebase/firestore";

import { db } from "../../../../firebase"

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { coupon, email, cc, licensekey } = req.body;

  // Firestore'dan tüm kupon verilerini alalım
  const couponsCollection = collection(db, "coupons");
  const couponsSnapshot = await getDocs(couponsCollection);
  const couponsData = couponsSnapshot.docs.map((d) => ({ ...d.data() }));

  const couponData = couponsData.find(x => x.couponCode === coupon);

  if (!couponData) {
    return res.status(404).json({ error: 'Coupon not found' });
  }

  const { expiryDate } = couponData;

  const formattedLicenseKey = licensekey.replace(/^(.{4})-(.{4})-(.{4})-(.{4})$/, '$1-XXXX-XXXX-$4');

  const resend = new Resend(process.env.RESEND_API_KEY);

  const formattedExpiryDate = new Date(expiryDate.seconds * 1000).toLocaleString('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const emailOptions = {
    from: "CDRCloud Promosyon <coupon@order.k2msoftware.com>",
    to: email,
    subject: 'Promosyon Kodu',
    html: `<div style="font-family: Arial, sans-serif; text-align: center; background-color: #f5f5f5; padding: 20px;">
        <h1 style="color: #333;">Promosyon Kodu</h1>
        <p style="color: #666;">${formattedLicenseKey} 3CX lisanslı ile birlikte <a href="https://www.CDRCloud.com">CDRCloud.com</a>'da 1 yıl süreyle ücretsiz geçerli olan kupon kodunuz:</p>
        <div style="background-color: #fff; border: 1px solid #ddd; padding: 10px; display: inline-block;">
          <p style="font-size: 18px; color: #333; font-weight: bold; margin: 0;">${coupon}</p>
        </div>
        <p style="color: #666;">Kuponun geçerlilik tarihi ${formattedExpiryDate}</p>
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
