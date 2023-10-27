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

    const { licenseKey, couponCode } = req.body;

    // Öncelikle bugünün tarihini alalım
    const today = new Date();

    // Firestore'dan tüm kupon verilerini alalım
    const couponsCollection = collection(db, "coupons");
    const couponsSnapshot = await getDocs(couponsCollection);
    const couponsData = couponsSnapshot.docs.map((d) => ({ ...d.data() }));

    // License key ve coupon code'u içeren objenin sayısını sayalım
    const matchingCoupons = couponsData.filter(coupon => {
        console.log(`${coupon.licensekey} - ${coupon.couponCode}`)
        // Hem licenseKey hem de couponCode eşleşmeli
        return coupon.licensekey === licenseKey && coupon.couponCode === couponCode;
    });

    // Sonuçları kontrol edip JSON yanıtını oluşturalım
    if (matchingCoupons.length === 0) {
        // License key ve coupon code eşleşen bir kupon bulunamadı
        return res.status(200).json({ status: false });
    } else {
        // License key ve coupon code eşleşen bir kupon bulundu, şimdi tarih kontrolü yapalım
        const hasValidDate = matchingCoupons.some(coupon => {
          
            if (coupon.expiryDate) {
                const expirationDate = coupon.expiryDate.toDate();
                return today <= expirationDate;
            }
            // ExpiryDate yoksa varsayılan olarak geçerli kabul edebilirsiniz.
            return true;
        });

        if (hasValidDate) {
            return res.status(200).json({ status: true });
        } else {
            return res.status(200).json({ status: false });
        }
    }
}
