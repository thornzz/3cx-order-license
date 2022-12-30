function extractData(arr) {
    const result = [];
    for (const obj of arr) {
        const { ResellerName, endUser, DateTime } = obj.tcxResponses.Items[0];
        for (const license of obj.tcxResponses.Items[0].LicenseKeys) {
            const { Edition, LicenseKey, SimultaneousCalls } = license;
            result.push({ ResellerName, endUser, DateTime, Edition, LicenseKey, SimultaneousCalls });
        }
    }
    return result;
}
export default extractData