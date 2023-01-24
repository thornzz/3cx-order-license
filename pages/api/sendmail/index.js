export async function GetParsedData(data) {
  const moment = require("moment");

  // Extract all the data
  let items = data.Items.filter(item => item.Type === "NewLicense").flatMap((item) => {
   
      let resellerName = item.ResellerName;
      let dateTime = moment(item.DateTime).format("DD.MM.YYYY HH:mm");
      return item.LicenseKeys.map((licenseKey) => {
        return {
          ResellerName: resellerName,
          DateTime: dateTime,
          LicenseKey: licenseKey.LicenseKey,
          SimultaneousCalls: licenseKey.SimultaneousCalls,
          Edition: licenseKey.Edition,
          IsPerpetual: licenseKey.IsPerpetual,
        };
      });
    
  });

  return items;
}

export default async function handler(req, res) {
  try {
    const data = await req.body;
    const items = await GetParsedData(data);
    let nodemailer = require("nodemailer");

    if (req.method === "POST") {
      const transporter = nodemailer.createTransport({
        port: 587,
        host: "mail.buluttel.com",
        auth: {
          user: "order@k2msoftware.com",
          pass: process.env.NEXT_PUBLIC_MAILPASS,
        },
        ignoreTLS: false,
        requireTLS: true,
      });

      items.forEach((item) => {
        let mailData = {
          from: "order@k2msoftware.com",
          to: "order@k2msoftware.com",
          subject: `${item.ResellerName}`,
          text: "",
          html: `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          
              <style type="text/css">
                body{
                  background-color: #374151;
                  padding: 0;
                  margin: 0;
                }
                .container{
                  width: 100vw;
                  height: 100vh;
                  margin-left: auto;
                  margin-right: auto
                }
                .inner-container{
                  width: 700px;
                  margin-left: auto;
                  margin-right: auto
                }
                .center {
                  display: block;
                  margin-left: auto;
                  margin-right: auto;
                  width: 100%;
                }
          
                .mt-1 {
                  margin-top: 4px
                }
          
                .rounded-md {
                  border-radius: 0.375rem
                }
          
                .border-b-4 {
                  border-bottom-width: 4px
                }
          
                .border-gray-200 {
                  border-color: #e5e7eb
                }
          
                .bg-gray-700 {
                  background-color: #374151
                }
          
                .bg-gray-50 {
                  background-color: #f9fafb
                }
          
                .bg-gray-300 {
                  background-color: #d1d5db
                }
          
                .px-4 {
                  padding-left: 16px;
                  padding-right: 16px
                }
          
                .py-5 {
                  padding-top: 20px;
                  padding-bottom: 20px
                }
          
                .pl-1 {
                  padding-left: 4px
                }
          
                .text-lg {
                  font-size: 18px
                }
          
                .font-medium {
                  font-weight: 500
                }
          
                .text-sky-500 {
                  color: #0ea5e9
                }
          
                .text-gray-900 {
                  color: #111827
                }
          
                
                  .col-span-2 {
                    grid-column: span 2 / span 2
                  }
          
                  .mt-0 {
                    margin-top: 0
                  }
          
                  .grid {
                    display: grid
                  }
          
                 .grid-cols-3 {
                    grid-template-columns: repeat(3, minmax(0, 1fr))
                  }
          
                  .gap-4 {
                    gap: 16px
                  }
          
                  .px-6 {
                    padding-left: 24px;
                    padding-right: 24px
                  }
                
              </style>
              <title>template</title>
            </head>
            <body>
              <div class="container">
                <div class="inner-container flex">
                  <image class="center" src="https://order.k2msoftware.com/cert.png" alt="3CX Cert" width="700px" height="500px"></image>
                  <div style="width:700px">
                    <dl style="margin:0">
                      <div class="bg-gray-50 px-4 py-5 grid grid-cols-3 gap-4 px-6">
                        <dt class="text-lg font-medium text-sky-500">License Key</dt>
                        <dd class="mt-1 pl-1  text-md text-gray-900 bg-gray-300 col-span-2 mt-0">
                        ${item.LicenseKey}
                        </dd>
                      </div>
                      <div class="bg-gray-50 px-4 py-5 grid grid-cols-3 gap-4 px-6">
                        <dt class="text-lg font-medium text-sky-500">Version</dt>
                        <dd class="mt-1 pl-1 text-md text-gray-900 bg-gray-300 col-span-2 mt-0">
                        ${item.Edition}
                        </dd>
                      </div>
                      <div class="bg-gray-50 px-4 py-5 grid grid-cols-3 gap-4 px-6">
                        <dt class="text-lg font-medium text-sky-500">Type</dt>
                        <dd class="mt-1 pl-1 text-md text-gray-900 bg-gray-300 col-span-2 mt-0">
                        ${item.IsPerpetual ? "Perpetual" : "Annual"}
                        </dd>
                      </div>
                      <div class="bg-gray-50 px-4 py-5 grid grid-cols-3 gap-4 px-6">
                        <dt class="text-lg font-medium text-sky-500">Size</dt>
                        <dd class="mt-1 pl-1  text-md text-gray-900 bg-gray-300 col-span-2 mt-0">
                        ${item.SimultaneousCalls} SC
                        </dd>
                      </div>
                      <div class="bg-gray-50 px-4 py-5 grid grid-cols-3 gap-4 px-6">
                        <dt class="text-lg font-medium text-sky-500">Purchased On</dt>
                        <dd class="mt-1 pl-1 text-md text-gray-900 bg-gray-300 col-span-2 mt-0">
                        ${item.DateTime}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </body>
          </html>`,
        };

        transporter.sendMail(mailData, function (err, info) {
          if (err) console.log(err);
        });
      });

      res.status(200).end();
    } else {
      res.json({ error: "Method is not allowed" });
      res.status(404).end();
    }
  } catch (error) {
    res.status(500).json(error);
  }
}
