async function PostData(url = '', data = {}) {
    // Determine the type of the data parameter
    const dataType = typeof data;

    // If the data parameter is an object, convert it to a string using JSON.stringify
    let postData;
    if (dataType === 'object') {
        postData = JSON.stringify(data);
    } else {
        postData = data;
    }

    // Rest of the function remains the same
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
        body: postData // body data type must match "Content-Type" header
    }).catch((error) => {
        console.log(error)
    });
    
    return response.json();
}

export default PostData;
