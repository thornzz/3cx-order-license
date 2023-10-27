const mergeEndUserwithLicense = async (firstJsonArray, secondJsonArray) => {
    const updatedJSON = firstJsonArray.map(item => ({ ...item })); // JSON nesnelerini kopyala

    for (let i = 0; i < updatedJSON.length; i++) {
        const firstLicenseKey = updatedJSON[i].LicenseKey;
        let foundMatch = false; // Eşleşme bulunup bulunmadığını takip etmek için bir bayrak

        for (let j = 0; j < secondJsonArray.length; j++) {
            if (firstLicenseKey === secondJsonArray[j].licenseKey) {
                updatedJSON[i].companyName = secondJsonArray[j].companyName;
                foundMatch = true; // Eşleşme bulundu
                break; // Eşleşme bulunduğunda döngüden çık
            }
        }

        // Eşleşme bulunmadıysa companyName'i boş bırak
        if (!foundMatch) {
            updatedJSON[i].companyName = "";
        }
    }

    return updatedJSON; // Güncellenmiş JSON nesnesini döndür
};

export default mergeEndUserwithLicense;
