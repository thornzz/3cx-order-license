import React, { Fragment, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { cart, cartDetail } from "../atoms/shoppingCartAtom";
import PostData from "../utility/HttpPostUtility";
import { Modal } from "flowbite-react";
import { GrLicense } from "react-icons/gr";
import { TbLicense } from "react-icons/tb";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
function UpgradeLicenseModal(props) {
  const [showLicenseCard, setShowLicenseCard] = useState(true);
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseKeyData, setLicenseKeyData] = useState(null);
  const [formattedLicenseKey, setFormattedLicenseKey] = useState("");
  const [cartState, setCartState] = useRecoilState(cart);
  const [cartDetailState, setDetailCartState] = useRecoilState(cartDetail);
  const [licenseType, setLicenseType] = useState("Professional");
  const [simCall, setSimCall] = useState(64);
  const [licenseKeyDetail, setLicenseKeyDetail] = useState(null);
  const router = useRouter();
  const [preformattedUpgradeLicenseKey, setpreFormattedUpgradeLicenseKey] =
    useState(null);
  const [
    preFormattedUpgradeModalIsActive,
    setPreFormattedUpgradeModalIsActive,
  ] = useState(false);

  useEffect(() => {
    if (
      props.upgradeLicenseKey !== null &&
      props.upgradeLicenseKey !== undefined &&
      props.showModal
    ) {
      setpreFormattedUpgradeLicenseKey(props.upgradeLicenseKey.licenseKey);
      setPreFormattedUpgradeModalIsActive(true);
    }
  });
  useEffect(() => {
    if (
      preformattedUpgradeLicenseKey?.length === 19 &&
      preFormattedUpgradeModalIsActive
    ) {
      console.log("upgrade license modal düzenle");
      setFormattedLicenseKey(preformattedUpgradeLicenseKey);
      const fetchData = async () => {
        const response = await getUpgradeLicenseData(
          preformattedUpgradeLicenseKey,
          licenseType,
          simCall
        );
        if (response.status === 200) {
          const json = await response.json();
          setLicenseKeyData(json);
          const licenseKeyInfo = await fetch(`/api/licenseinfo/${preformattedUpgradeLicenseKey}/${false}`).then((res) => res.json());
          setLicenseKeyDetail(licenseKeyInfo);
          setShowLicenseCard(true);
        } else {
          setShowLicenseCard(false);
          setLicenseKeyData(undefined);
        }
      };
      fetchData();
    }
  }, [preFormattedUpgradeModalIsActive, preformattedUpgradeLicenseKey]);

  useEffect(() => {
    // Update formattedLicenseKey when licenseKey changes
    setFormattedLicenseKey(
      licenseKey.replace(/([^-]{4})(?=[^-])/g, "$1-") // Add new hyphens after every fourth character that is not already a hyphen
    );
  }, [licenseKey]);

  useEffect(() => {
    if (licenseKeyData !== null && licenseKeyData !== undefined)
      setLicenseType(licenseKeyData[0]?.FromEdition);
  }, [licenseKeyData]);

  useEffect(() => {
    if (licenseKey.length === 16) {
      console.log("renew license modal regular");
      const fetchData = async () => {
        const response = await getUpgradeLicenseData(formattedLicenseKey);
        if (response.status === 200) {
          const json = await response.json();
          const licenseKeyInfo = await fetch(
            `/api/licenseinfo/${formattedLicenseKey}/${false}`
          ).then((res) => res.json());
          setLicenseKeyDetail(licenseKeyInfo);

          setLicenseKeyData(json);
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

  const addCart = async () => {
    const upgradeLicense = {
      Type: "Upgrade",
      UpgradeKey: formattedLicenseKey,
      Edition: licenseType,
      SimultaneousCalls: simCall,
      ResellerId: null,
      AddHosting: false,
    };

    setCartState([...cartState, upgradeLicense]);
    const res = await PostJsonData(upgradeLicense);
    res.Items[0].endUser = {};
    res.Items[0].ResellerName = "";
    setDetailCartState([...cartDetailState, res]);

    toast.info("Ürün sepete eklendi.", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  const PostJsonData = async (data) => {
    const postData = {
      PO: "MYPO123",
      SalesCode: "",
      Notes: "",
      Lines: [data],
    };
    try {
      const responseData = await PostData(
        "/api/newlicense",
        JSON.stringify(postData)
      );
      console.log(responseData);
      return responseData;
    } catch (error) {
      console.error(error);
    }
  };

  const getUpgradeLicenseData = async (licenseKey) => {
    const response = await fetch(`/api/upgrade/${licenseKey}`);
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

  const closeModal = () => {
    setLicenseKey("");
    setLicenseKeyData(undefined);
    setpreFormattedUpgradeLicenseKey("");
    setFormattedLicenseKey("");
    if(props.upgradeLicenseKey.setLicenseKey!==undefined) props?.upgradeLicenseKey?.setLicenseKey("")
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
              Lisans Yükseltme
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
                      <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="select1"
                >
                  Geçerli Lisans Bilgisi
                </label>
                <div className="flex justify-between items-center mb-3">
                  <div className="inline-flex items-center self-start">
                    <TbLicense className="h-8 w-8 mr-2 bg-gradient-to-r from-pink-600 to-red-600 shadow-lg rounded p-1.5 text-gray-100" />
                    <span className="font-bold text-gray-900">
                      {`${licenseKeyDetail?.Edition} Sürüm / ${licenseKeyDetail?.SimultaneousCalls} Kanal / ${licenseKeyDetail?.RemainingDays} Gün`}
                    </span>
                  </div>
                </div>
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="select1"
                >
                  Yükseltilecek Lisans Bilgileri
                </label>
                <div className="relative rounded-md shadow-sm">
                  <select
                    id="select1"
                    className="form-select w-full py-2 px-3 py-0 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none focus:outline-none focus:shadow-outline"
                    value={licenseType}
                    onChange={(event) => setLicenseType(event.target.value)}
                  >
                    <option value="">Lisans Tipini Seçiniz</option>
                    {licenseKeyData &&
                    licenseKeyData[0]?.FromEdition !== "Enterprise" ? (
                      <option value="Professional">Professional</option>
                    ) : null}
                    <option value="Enterprise">Enterprise</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
                </div>

                <label
                  className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                  htmlFor="select2"
                >
                  Kanal Sayısı
                </label>
                <div className="relative rounded-md shadow-sm mb-3">
                  <select
                    id="select2"
                    className="form-select w-full py-2 px-3 py-0 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none focus:outline-none focus:shadow-outline"
                    value={simCall}
                    onChange={(event) => setSimCall(event.target.value)}
                  >
                    <option value="">Kanal sayısını seçiniz</option>
                    <option value="8">8</option>
                    <option value="16">16</option>
                    <option value="24">24</option>
                    <option value="32">32</option>
                    <option value="48">48</option>
                    <option value="64">64</option>
                    <option value="96">96</option>
                    <option value="128">128</option>
                    <option value="192">192</option>
                    <option value="256">256</option>
                    <option value="512">512</option>
                    <option value="1024">1024</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"></div>
                </div>
                <div className="flex w-full justify-between">
                  <button
                    onClick={() => addCart()}
                    className="px-4 py-2 py-1.5 mr-2 w-[200px] rounded-md shadow-lg bg-gradient-to-r from-pink-600 to-red-600 font-medium text-gray-100 block transition duration-300"
                    type="button"
                  >
                    Sepete Ekle
                  </button>

                  <button
                    onClick={async () => {
                      addCart();
                      await router.push("/cart");
                    }}
                    className="px-4 py-2 py-1.5 w-[200px] rounded-md shadow-lg bg-gradient-to-r from-blue-600 to-green-600 font-medium text-gray-100 block transition duration-300"
                    type="button"
                  >
                    Sepete Ekle/Git
                  </button>
                </div>
              </Fragment>
            )}
          </form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}

export default UpgradeLicenseModal;
