import { DateTime as LuxonDateTime } from "luxon";

const extractData = async (arr, partnerData) => {
  let result = [];
  let partnerMap = new Map(
    partnerData.map((partner) => [partner.PartnerId, partner])
  );

  for (const obj of arr) {
    let { objectId } = obj;
    for (const item of obj.tcxResponses.Items) {
      const {
        ResellerName,
        endUser,
        Type,
        DateTime,
        InvoiceId,
        Line,
        ResellerId,
      } = item;
      for (const license of item.LicenseKeys) {
        let { Edition, LicenseKey, SimultaneousCalls, IsPerpetual } = license;

        if (item.Type === "Upgrade") {
          const elementToSplit = item.ProductDescription.split("\n")[1];
          // Use the match method to extract the values
          const [, , , , type, simcall] = elementToSplit.match(/\w+/g);
          Edition = type;
          SimultaneousCalls = simcall;
        }

        let partner = partnerMap.get(ResellerId);
        let partnerInfo = partner
          ? {
              PartnerLevelName: partner.PartnerLevelName,
              DiscountPercent: partner.DiscountPercent,
            }
          : {};

        result.push({
          objectId,
          Line,
          InvoiceId,
          ResellerName,
          endUser,
          Type,
          DateTime: LuxonDateTime.fromSeconds(DateTime.seconds).toFormat(
            "dd.MM.yyyy"
          ),
          Edition,
          LicenseKey,
          SimultaneousCalls,
          IsPerpetual,
          ...partnerInfo,
        });
      }
    }
  }

  let moment = require("moment");

  result.sort(function (a, b) {
    return (
      moment(b.DateTime, "DD.MM.YYYY").unix() -
      moment(a.DateTime, "DD.MM.YYYY").unix()
    );
  });

  return result;
};
export default extractData;
