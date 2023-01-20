import React, { Fragment, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { GrLicense } from "react-icons/gr";
import { BiPaste } from "react-icons/bi";
import PostData from "../utility/HttpPostUtility";
import { toast } from "react-toastify";
import { useRecoilState } from "recoil";
import { cart, cartDetail } from "../atoms/shoppingCartAtom";
import { useRouter } from "next/router";
import { getLicenceKeyInfo } from "../pages/api/licenseinfo/[...slug]";
import { TbLicense } from "react-icons/tb";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Icon,
} from "@chakra-ui/react";
const LicenseRenewModal = (props) => {
  const [showLicenseCard, setShowLicenseCard] = useState(false);
  const [years, setYears] = useState(1);
  const [licenseKey, setLicenseKey] = useState("");
  const [licenseKeyData, setLicenseKeyData] = useState("");
  const [licenseKeyDetail, setLicenseKeyDetail] = useState(null);
  const [formattedLicenseKey, setFormattedLicenseKey] = useState("");
  const [cartState, setCartState] = useRecoilState(cart);
  const [cartDetailState, setDetailCartState] = useRecoilState(cartDetail);
  const [preFormattedRenewalKey, setpreFormattedRenewalKey] = useState(null);
  const [error, setError] = useState(null);
  const [
    preFormattedRenewalModalIsActive,
    setPreFormattedRenewalModalIsActive,
  ] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (
      props.renewalLicenseKey !== null &&
      props.renewalLicenseKey !== undefined &&
      props.showModal
    ) {
      setpreFormattedRenewalKey(props.renewalLicenseKey.licenseKey);
      setPreFormattedRenewalModalIsActive(true);
    }
  });
  useEffect(() => {
    if (
      preFormattedRenewalKey?.length === 19 &&
      preFormattedRenewalModalIsActive
    ) {
      setFormattedLicenseKey(preFormattedRenewalKey);
      const fetchData = async () => {
        const response = await getRenewLicenseData(
          preFormattedRenewalKey,
          years
        );
        const json = await response.json();
        if (json?.status === 400) {
          setError(json.detail);
          setShowLicenseCard(false);
          setLicenseKeyData(undefined);
        } else {
          setLicenseKeyData(json);
          const licenseKeyInfo = await fetch(
            `/api/licenseinfo/${preFormattedRenewalKey}/${json.IsPerpetual}`
          ).then((res) => res.json());
          setLicenseKeyDetail(licenseKeyInfo);
          setShowLicenseCard(true);
        }
      };
      fetchData();
    }
  }, [preFormattedRenewalModalIsActive, preFormattedRenewalKey]);
  useEffect(() => {
    // Update formattedLicenseKey when licenseKey changes
    setFormattedLicenseKey(
      licenseKey.replace(/([^-]{4})(?=[^-])/g, "$1-") // Add new hyphens after every fourth character that is not already a hyphen
    );
  }, [licenseKey]);
  useEffect(() => {
    if (licenseKey.length === 16) {
      const fetchData = async () => {
        const response = await getRenewLicenseData(formattedLicenseKey, years);
        const json = await response.json();
        if (json?.status) {
          setError(json.detail);
          setShowLicenseCard(false);
          setLicenseKeyData(undefined);
        } else {
          setLicenseKeyData(json);
          const licenseKeyInfo = await fetch(
            `/api/licenseinfo/${formattedLicenseKey}/${json.IsPerpetual}`
          ).then((res) => res.json());
          setLicenseKeyDetail(licenseKeyInfo);
          setShowLicenseCard(true);
        }
      };
      fetchData();
    } else {
      setShowLicenseCard(false);
      setError(null);
      setLicenseKeyData(undefined);
    }
  }, [formattedLicenseKey]);

  const addCart = async () => {
    const renewAnnualorPerpetual = {
      Type: licenseKeyData.IsPerpetual ? "Maintenance" : "RenewAnnual",
      UpgradeKey: formattedLicenseKey,
      Quantity: years,
      ResellerId: null,
    };

    setCartState([...cartState, renewAnnualorPerpetual]);
    const res = await PostJsonData(renewAnnualorPerpetual);
    //res.Items[0].endUser = {};
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
      //Lines: [data]
      Lines: [data],
    };

    try {
      const responseData = await PostData(
        "/api/fakelicenseorder",
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

  const pasteClipboard = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setLicenseKey(clipboardText);
    handleLicenseKeyChange({ target: { value: clipboardText } });
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
      if (error) {
        setError(null);
      }
    }
  };

  const closeModal = () => {
    setError(null);
    setLicenseKey("");
    setLicenseKeyData(undefined);
    setLicenseKeyDetail(null);
    setPreFormattedRenewalModalIsActive(false);
    setpreFormattedRenewalKey("");
    setFormattedLicenseKey("");
    if (props.renewalLicenseKey.setLicenseKey !== undefined)
      props?.renewalLicenseKey?.setLicenseKey("");

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
              Lisans Yenileme
            </label>
            {/* <label className="text-md font-medium">Lisans Anahtarı</label>

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
            </label> */}
            <InputGroup size="md" mt={"2"}>
              <Input
                mb={"2"}
                pr="4.5rem"
                type={"text"}
                placeholder="Lisans anahtarını giriniz..."
                value={formattedLicenseKey}
                onChange={handleLicenseKeyChange}
                onPaste={pasteClipboard}
              />
              <InputLeftElement width="2.5rem" mr={"2"}>
                <Icon boxSize="6" as={TbLicense} />
              </InputLeftElement>
              <InputRightElement width="2.5rem" onClick={pasteClipboard}>
                <Icon boxSize="6" as={BiPaste} />
              </InputRightElement>
            </InputGroup>
            {error && (
              <Alert status="error" variant="left-accent">
                <AlertIcon />
                <AlertDescription fontSize="xs">{error}</AlertDescription>
              </Alert>
            )}
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

                <div className="flex flex-row-reverse mb-2">
                  <button
                    type="button"
                    className="bg-yellow-600 p-1.5 font-bold rounded w-10 h-10"
                    onClick={() => setYears(years > 1 ? years - 1 : years)}
                  >
                    -
                  </button>
                  <input
                    id="item_count"
                    type="number"
                    className="max-w-[100px] font-bold py-1.5 px-2 mx-1.5
            block border border-gray-300 rounded-md text-sm shadow-sm  placeholder-gray-400 text-center
            focus:outline-none
            focus:border-sky-500
            focus:ring-1
            focus:ring-sky-500
            focus:invalid:border-red-500  focus:invalid:ring-red-500"
                    disabled={true}
                    min={1}
                    max={5}
                    value={years}
                  />

                  <button
                    type="button"
                    className="bg-green-600 p-1.5 font-bold rounded w-10 h-10"
                    onClick={() => setYears(years < 5 ? years + 1 : years)}
                  >
                    +
                  </button>
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
};

export default LicenseRenewModal;
