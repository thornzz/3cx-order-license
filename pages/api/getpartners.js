import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../firebase/index";

export async function getPartners() {
  try {
    let data = null;

    const username = process.env.NEXT_PUBLIC_3CX_API_KEY;
    const password = ""; // Your password goes here
    const basicAuth = btoa(`${username}:${password}`);

    const response = await fetch(
      "https://api.3cx.com/public/v1/order/partners",
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
        },
      }
    );

    // Check if the response status code is 200
    if (response.status === 200) {
      data = await response.json();
    } else {
      // order api cant be connected
      const partnersRef = query(collection(db, "partners"));
      const partnersSnapshot = await getDocs(partnersRef);
      data = partnersSnapshot.docs.map((d) => ({ ...d.data() }));
    }

    // Extract only the PartnerId and CompanyName fields from each object in the array
    const filteredData = data.map((partner) => ({
      PartnerId: partner.PartnerId,
      CompanyName: partner.CompanyName,
      ContactName: partner.ContactName,
      PartnerLevelName: partner.PartnerLevelName,
      Email: partner.ContactEmail,
      ContactPhone: partner.ContactPhone,
      DiscountPercent: partner.DiscountPercent,
    }));

    // Send the filtered data as the response
    return filteredData;
  } catch (error) {
    console.log(error);
  }
}
export default async function handler(req, res) {
  try {
    const jsonData = await getPartners();
    res.status(200).json(jsonData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
