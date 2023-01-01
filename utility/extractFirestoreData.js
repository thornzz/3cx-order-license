import { DateTime as LuxonDateTime } from 'luxon';

const extractData = async (arr) => {
        let result = [];
        for (const obj of arr) {
            const { ResellerName, endUser, DateTime } = obj.tcxResponses.Items[0];
            for (const license of obj.tcxResponses.Items[0].LicenseKeys) {
                const { Edition, LicenseKey, SimultaneousCalls } = license;
                result.push({ ResellerName, endUser, DateTime:LuxonDateTime.fromSeconds(DateTime.seconds).toFormat('dd.MM.yyyy'), Edition, LicenseKey, SimultaneousCalls });
            }
        }
        console.log(result)
        // result = result.map(obj => Object.values(obj));

        return result;
}
export default extractData