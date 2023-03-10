export default async function handler(req, res) {
  try {
    // Make a request to the remote API endpoint to get the JSON response
    const username = process.env.NEXT_PUBLIC_3CX_API_KEY;
    const password = "";
    const basicAuth = btoa(`${username}:${password}`);
    const { slug } = req.query;
    const licensekey = slug[0];
    // const toEdition = slug[1]
    // const toSimCalls = slug[2]

    if (licensekey.length == 18) {
      return res.status(400).json();
    } else {
      const response = await fetch(
        `https://api.3cx.com/public/v1/order/LicenseUpgradePrices?licensekey=${licensekey}`,
        {
          headers: {
            Authorization: `Basic ${basicAuth}`,
          },
        }
      );

      const data = await response.json();
      if (typeof data === "object" && data.length === 0) {
        return res.status(200).json({
          status: 400,
          detail: "This license key not available for upgrade",
        });

      } else res.status(200).json(data);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
