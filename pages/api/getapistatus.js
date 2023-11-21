export async function getOrderApiStatus() {
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

        // Check if the response status code is 200
        if (response.status === 200) {
            return { status: true };
        } else {
            return { status: false };
        }

    } catch (error) {
        console.log(error);
        return { status: false }; // Handle other errors and return false
    }
}

export default async function handler(req, res) {
    try {
        const jsonData = await getOrderApiStatus();
        res.status(200).json(jsonData);
    } catch (error) {
        console.log(error)
        res.status(500).json({ status: false });
    }
}
