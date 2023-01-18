import React, { Fragment, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { GrLicense } from "react-icons/gr";
import { TbLicense, TbSquareMinus, TbSquarePlus } from "react-icons/tb";
import PostData from "../utility/HttpPostUtility";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { cart, cartDetail } from "../atoms/shoppingCartAtom";
import { useRouter } from "next/router";
import { getLicenceKeyInfo } from "../pages/api/licenseinfo/[...slug]";

const LicenseCheckModal = (props) => {
  const [showLicenseCard, setShowLicenseCard] = useState(false);
  const [years, setYears] = useState(1);
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseKeyData, setLicenseKeyData] = useState("");
  const [licenseKeyDetail, setLicenseKeyDetail] = useState(null);
  const [formattedLicenseKey, setFormattedLicenseKey] = useState("");
  const [cartState, setCartState] = useRecoilState(cart);
  const [cartDetailState, setDetailCartState] = useRecoilState(cartDetail);

  const router = useRouter();

  useEffect(() => {
    // Update formattedLicenseKey when licenseKey changes
    setFormattedLicenseKey(
      licenseKey.replace(/([^-]{4})(?=[^-])/g, "$1-") // Add new hyphens after every fourth character that is not already a hyphen
    );
  }, [licenseKey]);
  useEffect(() => {
    if (licenseKey.length === 16) {
      console.log("renew license modal regular");
      const fetchData = async () => {
        const response = await getRenewLicenseData(formattedLicenseKey, years);
        if (response.status === 200) {
          const json = await response.json();
          setLicenseKeyData(json);
          const licenseKeyInfo = await fetch(
            `/api/licenseinfo/${formattedLicenseKey}/${json.IsPerpetual}`
          ).then((res) => res.json());
          setLicenseKeyDetail(licenseKeyInfo);
          setShowLicenseCard(true);
        } else {
          setShowLicenseCard(false);
          setLicenseKeyData(undefined);
        }
      };
      fetchData();
    } else {
      setShowLicenseCard(false);
      setLicenseKeyData(undefined);
    }
  }, [formattedLicenseKey]);

  const PostJsonData = async (data) => {
    const postData = {
      PO: "MYPO123",
      SalesCode: "",
      Notes: "",
      //Lines: [data]
      Lines: [data],
    };

    try {
      const responseData = await PostData(
        "/api/newlicense",
        JSON.stringify(postData)
      );

      return responseData;
    } catch (error) {
      console.error(error);
    }
  };

  const getRenewLicenseData = async (lic, year) => {
    const response = await fetch(`/api/renew/${lic}/${year}`);
    return response;
  };

  const handleLicenseKeyChange = async (event) => {
    let value = event.target.value;
    // Only allow digits, letters, and hyphens
    if (/^[0-9A-Za-z-]*$/.test(value)) {
      // Limit the length of the value to 16 characters, excluding hyphens
      value = value.replace(/-/g, "").slice(0, 16);

      // Make the value uppercase
      value = value.toUpperCase();
      setLicenseKey(value);
    }
  };

  const openLicenseUpgradeModal = () => {
    props.closeModal();
    props.setLicenseKey(formattedLicenseKey)
    setLicenseKey("");
    setLicenseKeyData(undefined);
    setLicenseKeyDetail(null);
    props.showUpgradeModal();

  };
  const openLicenseRenewalModal = () => {
    props.closeModal();
    props.setLicenseKey(formattedLicenseKey)
    setLicenseKey("");
    setLicenseKeyData(undefined);
    setLicenseKeyDetail(null);
    props.showRenewModal();
  };

  const closeModal = () => {
    setLicenseKey("");
    setLicenseKeyData(undefined);
    setLicenseKeyDetail(null);

    props.closeModal();
  };
  return (
    <Fragment>
      <Modal
        show={props.showModal}
        size="lg"
        popup={true}
        onClose={() => closeModal()}
      
      >
        <Modal.Header />
        <Modal.Body>
          <form className="flex flex-col justify-center">
            <label
              className="block text-gray-700 text-md text-center font-bold mb-2"
              htmlFor="select1"
            >
              Lisans Sorgulama
            </label>
            <label className="text-md font-medium">Lisans Anahtarı</label>

            <label className="relative block mb-2">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                <GrLicense className="h-5 w-5" />
              </span>
              <input
                className="placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                placeholder="Lisans anahtarını giriniz..."
                type="text"
                name="licenseKey"
                value={formattedLicenseKey}
                onChange={handleLicenseKeyChange}
              />
            </label>
          
            {showLicenseCard && (
              <Fragment>
                <div className="container mx-auto mb-3  border-2 border-gray-200 shadow-lg">
                  <div class="overflow-hidden bg-white shadow sm:rounded-lg">
                    <div className="px-2 py-3 sm:px-4 flex items-center">
                      <TbLicense className="h-8 w-8 mr-2 bg-gradient-to-r from-pink-600 to-red-600 shadow-lg rounded p-1.5 text-gray-100" />
                      <h3 class="text-md font-medium leading-6 text-gray-900">
                        Lisans Bilgileri
                      </h3>
                    </div>
                    <div class="border-t border-gray-200">
                      <dl>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500">
                            Lisans Sürümü
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {licenseKeyDetail?.Edition}
                          </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500">
                            Lisans Tipi
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {licenseKeyDetail?.IsPerpetual
                              ? "Perpetual"
                              : "Annual"}
                          </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500">
                            Lisans Aktif mi?
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {licenseKeyDetail?.IsActive ? "Evet" : "Hayır"}
                          </dd>
                        </div>
                        <div class="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500">
                            Expiry Tarihi
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {licenseKeyDetail?.MaintenanceDate}
                          </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500">
                            Kanal Sayısı
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {licenseKeyDetail?.SimultaneousCalls}
                          </dd>
                        </div>
                        <div class="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt class="text-sm font-medium text-gray-500">
                            Kalan Gün
                          </dt>
                          <dd class="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                            {licenseKeyDetail?.RemainingDays}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>
             
                <div className="flex w-full justify-between">
                  <button
                    onClick={() => openLicenseRenewalModal()}
                    className="px-4 py-2 py-1.5 mr-2 w-[200px] rounded-md shadow-lg bg-gradient-to-r from-pink-600 to-red-600 font-medium text-gray-100 block transition duration-300"
                    type="button"
                  >
                    Lisans Yenileme
                  </button>

                  <button
                    onClick={async () => {
                      openLicenseUpgradeModal();
                    }}
                    className="px-4 py-2 py-1.5 w-[200px] rounded-md shadow-lg bg-gradient-to-r from-blue-600 to-green-600 font-medium text-gray-100 block transition duration-300
                    hover:"
                    type="button"
                  >
                    Lisans Yükseltme
                  </button>
                </div>
              </Fragment>
            )}
          </form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default LicenseCheckModal;
