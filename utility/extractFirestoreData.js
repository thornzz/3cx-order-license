import { DateTime as LuxonDateTime } from 'luxon';

const extractData = async (arr) => {
        let result = [];
        for (const obj of arr) {
            const { ResellerName, endUser, Type, DateTime,InvoiceId } = obj.tcxResponses.Items[0];
            for (const license of obj.tcxResponses.Items[0].LicenseKeys) {
                let { Edition, LicenseKey, SimultaneousCalls } = license;

                if (obj.tcxResponses.Items[0].Type==='Upgrade'){
                    const elementToSplit = obj.tcxResponses.Items[0].ProductDescription.split('\n')[1];
                    // Use the match method to extract the values
                    const [, , , , type , simcall] = elementToSplit.match(/\w+/g);
                    Edition = type
                    SimultaneousCalls = simcall
                }

                result.push({ ResellerName, endUser, Type, DateTime:LuxonDateTime.fromSeconds(DateTime.seconds).toFormat('dd.MM.yyyy'), Edition, LicenseKey, SimultaneousCalls });
            }
        }
        return result;
}
export default extractData