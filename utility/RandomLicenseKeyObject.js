function addRandomLicenseKey(json) {
    for (const item of json.Items) {
        const quantity = item.Quantity;

        for (let i = 0; i < quantity; i++) {
            // Generate a random license key
            const licenseKey = Array(4)
                .fill(null)
                .map(() =>
                    Array(4)
                        .fill(null)
                        .map(() => Math.random().toString(36).slice(-1).toUpperCase())
                        .join('')
                )
                .join('-');

            // Generate a random license key object
            const licenseKeyObject = {
                LicenseKey: licenseKey,
                SimultaneousCalls: Math.floor(Math.random() * 32) + 1,
                IsPerpetual: false,
                Edition: Math.random() > 0.5 ? "Professional" : "Enterprise",
                ExpiryIncludedMonths: 12,
                ExpiryDate: null,
                MaintenanceIncludedMonths: 12,
                MaintenanceDate: null,
                HostingIncludedMonths: null,
                HostingExpiry: null
            };

            // Add the license key object to the LicenseKeys array
            item.LicenseKeys.push(licenseKeyObject);
        }
    }
}

export default addRandomLicenseKey