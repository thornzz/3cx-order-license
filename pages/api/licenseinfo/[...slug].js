import PostData from "../../../utility/HttpPostUtility";
import {
  convertDateTime,
  calculateRemainingDay,
} from "../../../utility/DateTimeUtils";

export default async function handler(req, res) {
  const { slug } = req.query;
  const licensekey = slug[0];
  const licenseType = slug[1] === "true" ? "Maintenance" : "RenewAnnual";
  const isUpgrade = slug[2] === "true" ? "Upgrade" : null;

  try {
    const jsonData = await getLicenceKeyInfo(
      licensekey,
      licenseType,
      isUpgrade
    );
    res.status(200).json(jsonData);
  } catch (error) {
    res.status(400).json(error);
  }
}

export async function getLicenceKeyInfo(licensekey, licenseType, isUpgrade) {
  try {
    const jsonPostData = {
      PO: "MYPO123",
      SalesCode: "",
      Notes: "",
      Lines: [
        {
          Type: isUpgrade ? "Upgrade" : licenseType,
          UpgradeKey: licensekey,
          Edition: "Enterprise",
          SimultaneousCalls: 64,
          ResellerId: null,
          AddHosting: false,
        },
      ],
    };

    const handleError = (errorCode) => {
      switch (errorCode) {
        case "UpgradeIsNotAvailable":
          jsonPostData.Lines[0].Type = "Maintenance";
          break;
        case "CanNotUpgradeKeyWithAdditionalMaintenance":
          jsonPostData.Lines[0].Type = "Maintenance";
          break;
        case "CannotUpgradeKeyWithExpiredMaintenance":
          jsonPostData.Lines[0].Type = "Maintenance";
          break;
        case "KeyVersionIsDeprecated":
          jsonPostData.Lines[0].Type = "RenewAnnual";
          break;
      }
    };

    let data = await PostData(
      "https://api.3cx.com/public/v1/order/?readonly=true",
      JSON.stringify(jsonPostData)
    );
    
    const { status, ErrorCode } = data;

    if (status && ErrorCode) {
      handleError(ErrorCode);

      data = await PostData(
        "https://api.3cx.com/public/v1/order/?readonly=true",
        JSON.stringify(jsonPostData)
      );
    }

    const desiredProperties = [
      "LicenseKey",
      "SimultaneousCalls",
      "IsPerpetual",
      "ExpiryDate",
      "MaintenanceDate",
      "HostingExpiry",
      "Edition",
    ];

    const desiredObject = {};
    desiredProperties.forEach((property) => {
      desiredObject[property] = data.Items[0].LicenseKeys[0][property];
    });

    if (desiredObject) {
      desiredObject.IsActive =
        desiredObject.MaintenanceDate !== null ||
        desiredObject.ExpiryDate !== null
          ? true
          : false;
      desiredObject.RemainingDays =
        desiredObject.MaintenanceDate !== null
          ? calculateRemainingDay(desiredObject.MaintenanceDate)
          : 0;
      desiredObject.ExpiryDate =
        desiredObject.ExpiryDate !== null
          ? convertDateTime(desiredObject.ExpiryDate)
          : "";
      desiredObject.MaintenanceDate =
        desiredObject.MaintenanceDate !== null
          ? convertDateTime(desiredObject.MaintenanceDate)
          : "";
    }

    return desiredObject;
  } catch (error) {
    console.log(error);
  }
}
