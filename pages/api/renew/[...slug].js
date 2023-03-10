export default async function handler(req, res) {

    try {
        // Make a request to the remote API endpoint to get the JSON response
        const username = process.env.NEXT_PUBLIC_3CX_API_KEY;
        const password = ''; // Your password goes here
        const basicAuth = btoa(`${username}:${password}`);
        const {slug} = req.query
        const licensekey = slug[0]
        const years = slug[1]

        if (licensekey.length == 18) {
            return res.status(400).json()
        } else {
            const response = await fetch(`https://api.3cx.com/public/v1/order/RenewPrice?licensekey=${licensekey}&years=${years}&addHosting=false`, {
                headers: {
                    'Authorization': `Basic ${basicAuth}`
                }
            });
            const data = await response.json();

            if (response.status == 200) {
                res.status(200).json(data);
            } else {
               
                res.status(400).json(data)
            }

        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}