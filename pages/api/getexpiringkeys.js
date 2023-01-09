
export async function getExpiringKeys(){
    try {
        // Make a request to the remote API endpoint to get the JSON response
        const username = process.env.NEXT_PUBLIC_3CX_API_KEY;
        const password = ''; // Your password goes here
        const basicAuth = btoa(`${username}:${password}`);

        const response = await fetch('https://api.3cx.com/public/v1/order/expiringkeys', {
            headers: {
                'Authorization': `Basic ${basicAuth}`
            }
        });

       return await response.json()

    } catch (error) {
       console.log(error)
    }

}
export default async function handler(req, res) {
    try {
        const jsonData = await getExpiringKeys()
        res.status(200).json(jsonData)
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}