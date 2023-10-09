
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase/index";

export async function getAdditionalPartners() {
    try {
        const collectionRef = collection(db, "additionalpartners");
        const q = query(collectionRef);
        const querySnapshot = await getDocs(q);
        const addPartners = querySnapshot.docs.map((d) => ({
            PartnerId: d.id,
            ...d.data(),
        }));

        return addPartners;
    } catch (error) {
        console.error("Hata:", error);
        throw error;
    }
}
