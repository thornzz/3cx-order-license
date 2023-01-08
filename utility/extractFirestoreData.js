import { DateTime as LuxonDateTime } from 'luxon';

const extractData = async (arr) => {

    let result = [];
    for (const obj of arr) {
        let {objectId} = obj
        for (const item of obj.tcxResponses.Items) {
            const { ResellerName, endUser, Type, DateTime, InvoiceId,Line} = item;
            for (const license of item.LicenseKeys) {
                let { Edition, LicenseKey, SimultaneousCalls } = license;

                if (item.Type === 'Upgrade') {
                    const elementToSplit = item.ProductDescription.split('\n')[1];
                    // Use the match method to extract the values
                    const [, , , , type, simcall] = elementToSplit.match(/\w+/g);
                    Edition = type
                    SimultaneousCalls = simcall
                }

                result.push({ objectId, Line, InvoiceId, ResellerName, endUser, Type, DateTime: LuxonDateTime.fromSeconds(DateTime.seconds).toFormat('dd.MM.yyyy'), Edition, LicenseKey, SimultaneousCalls });
            }
        }
    }
    return result;
}
export default extractData