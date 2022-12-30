function mergeJSONObjects(firstJSON, secondJSON) {
    for (let i = 0; i < secondJSON.Items.length; i++) {
        secondJSON.Items[i].endUser = firstJSON[i].Items[0].endUser;
        secondJSON.Items[i].ResellerName = firstJSON[i].Items[0].ResellerName;
        secondJSON.Items[i].DateTime = new Date()
    }
}

export default mergeJSONObjects