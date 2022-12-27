async function PostData(url = '', data = {}) {

    const username = process.env.NEXT_PUBLIC_3CX_API_KEY;
    const password = ''; // Your password goes here
    const basicAuth = btoa(`${username}:${password}`);

    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Basic ${basicAuth}`
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json();
}

export default PostData;