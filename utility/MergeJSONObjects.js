function mergeJSONObjects(firstJSON, secondJSON) {
    for (let i = 0; i < secondJSON.Items.length; i++) {
      //  secondJSON.Items[i].endUser = firstJSON[i].Items[0].endUser === undefined ? {} : firstJSON[i].Items[0].endUser
        secondJSON.Items[i].ResellerName = firstJSON[i].Items[0].ResellerName === undefined ? '': firstJSON[i].Items[0].ResellerName
        secondJSON.Items[i].ResellerId = firstJSON[i].Items[0].ResellerId
        secondJSON.Items[i].DateTime = new Date()
        secondJSON.Items[i].InvoiceId = null

    }
}

export default mergeJSONObjects