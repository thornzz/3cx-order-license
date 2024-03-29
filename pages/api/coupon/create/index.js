import { db } from "../../../../firebase/index"
import {
    addDoc,
    collection,
} from "firebase/firestore";

import { generateCouponCode } from "../../../../utility/generateCoupon";

export default async function handler(req, res) {

    if (req.method === "POST") {
        try {
            const { licensekey, partnerId } = req.body;

            console.log(licensekey)

            const couponCode = generateCouponCode();
            const newCouponObject = {
                partnerId: partnerId,
                licensekey: licensekey,
                couponCode: couponCode,
                createdAt: new Date(),
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)  // Bugünden 30 gün sonrası
            };
            await addDoc(collection(db, "coupons"), { ...newCouponObject });
            res.json({ couponCode: couponCode, licensekey: licensekey});
        } catch (error) {
            const errorData = { error: error.message };
            res.status(500).json(errorData);
        }
    } else {
        const errorData = { error: "Method is not allowed" };
        res.status(404).json(errorData);
    }


}