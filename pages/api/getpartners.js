
export default async function handler(req, res) {

    try {
        // Make a request to the remote API endpoint to get the JSON response
        const username = process.env.NEXT_PUBLIC_3CX_API_KEY;
        const password = ''; // Your password goes here
        const basicAuth = btoa(`${username}:${password}`);

        const response = await fetch('https://api.3cx.com/public/v1/order/partners', {
            headers: {
                'Authorization': `Basic ${basicAuth}`
            }
        });

        const data = await response.json();

        // Extract only the PartnerId and CompanyName fields from each object in the array
        const filteredData = data.map(partner => ({
            PartnerId: partner.PartnerId,
            CompanyName: partner.CompanyName,
        }));

        // Send the filtered data as the response
        res.status(200).json(filteredData);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}