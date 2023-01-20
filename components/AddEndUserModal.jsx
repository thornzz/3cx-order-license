import React, { Fragment, useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useRecoilState } from "recoil";
import { cartDetail } from "../atoms/shoppingCartAtom";
import { SlUser } from "react-icons/sl";
import { toast } from "react-toastify";
import { collection, getDocs, setDoc, doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { TbLicense } from "react-icons/tb";
import { BiPaste } from "react-icons/bi";
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

function AddEndUserModal(props) {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [telephone, setTelephone] = useState("");
  const [other, setOther] = useState("");
  const [licenseKey, setLicenseKey] = useState("");
  const [formattedLicenseKey, setFormattedLicenseKey] = useState("");

  const closeModal = () => {
    setCompanyName("");
    setAddress("");
    setTelephone("");
    setOther("");
    setEmail("");
    setLicenseKey("");
    props.closeModal();
  };
  useEffect(() => {
    // Update formattedLicenseKey when licenseKey changes
    setFormattedLicenseKey(
      licenseKey.replace(/([^-]{4})(?=[^-])/g, "$1-") // Add new hyphens after every fourth character that is not already a hyphen
    );
  }, [licenseKey]);

  useEffect(() => {
    if (licenseKey.length === 16) {
      const fetchEndUserData = async () => {
        await getEndUserData(formattedLicenseKey);
      };
      fetchEndUserData();
    }
  }, [formattedLicenseKey]);

  const addOrUpdateFirestoreEndUser = async () => {
    const enduserObject = {
      licenseKey: formattedLicenseKey,
      companyName: companyName,
      email: email,
      address: address,
      telephone: telephone,
      other: other,
    };

    try {
      await setDoc(doc(db, "endusers", formattedLicenseKey), {
        ...enduserObject,
      });
      toast.success("Kayıyt işlemi tamamlandı.", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      console.error("Error updating endUser in Item object: ", error);
    }
    closeModal();
  };
  const pasteClipboard = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setLicenseKey(clipboardText);
    handleLicenseKeyChange({ target: { value: clipboardText } });
  };

  const getEndUserData = async () => {
    try {
      const docRef = doc(db, "endusers", formattedLicenseKey);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setCompanyName(data.companyName);
        setAddress(data.address);
        setTelephone(data.telephone);
        setOther(data.other);
        setEmail(data.email);
      } else {
        setCompanyName("");
        setAddress("");
        setTelephone("");
        setOther("");
        setEmail("");
      }
    } catch (error) {
      console.error("Error updating endUser in Item object: ", error);
    }
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
  return (
    <Fragment>
      <Modal
        show={props.showModal}
        size="2xl"
        popup={true}
        onClose={() => closeModal()}
      >
        <Modal.Header />
        <Modal.Body>
          <div className="flex items-center w-full">
            <div className="w-full bg-white rounded shadow-2xl p-8 m-4">
              <h1 className="flex  items-center text-red-600 text-2xl font-ubuntu font-bold mb-6">
                <SlUser className="m-2 w-5 h-5 text-red-500" />
                End User Bilgi Girişi
              </h1>
              <form>
              <InputGroup size="lg" borderColor={"black"}>
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
                <div className="flex flex-col mb-4">
                  <label
                    className="mb-2 font-bold text-lg text-sky-900"
                    htmlFor="company_name"
                  >
                    Şirket Adı
                  </label>
                  <input
                    className="border py-2 px-3 text-grey-800"
                    type="text"
                    name="company_name"
                    id="company_name"
                    value={companyName}
                    onChange={(event) => setCompanyName(event.target.value)}
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label
                    className="mb-2 font-bold text-lg text-sky-900"
                    htmlFor="address"
                  >
                    Adres
                  </label>
                  <input
                    className="border py-2 px-3 text-grey-800"
                    type="text"
                    name="address"
                    id="address"
                    value={address}
                    onChange={(event) => setAddress(event.target.value)}
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label
                    className="mb-2 font-bold text-lg text-sky-900"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    className="border py-2 px-3 text-grey-800"
                    type="email"
                    name="email"
                    id="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label
                    className="mb-2 font-bold text-lg text-sky-900"
                    htmlFor="other"
                  >
                    Telefon
                  </label>
                  <input
                    className="border py-2 px-3 text-grey-800"
                    type="text"
                    name="other"
                    id="other"
                    value={telephone}
                    onChange={(event) => setTelephone(event.target.value)}
                  />
                </div>
                <div className="flex flex-col mb-4">
                  <label
                    className="mb-2 font-bold text-lg text-sky-900"
                    htmlFor="other"
                  >
                    Açıklama
                  </label>
                  <textarea
                    className="border py-2 px-3 text-grey-800"
                    name="other"
                    id="other"
                    value={other}
                    onChange={(event) => setOther(event.target.value)}
                  />
                </div>

                {props.expiringKeysData !== null &&
                props.expiringKeysData !==
                  undefined ? null : !props.tableData ? (
                  <button
                    className="flex flex-row-reverse bg-gray-900 hover:bg-blue-500 ease-in duration-300 text-white text-lg mx-auto p-5 rounded-lg"
                    type="button"
                    onClick={addOrUpdateFirestoreEndUser}
                  >
                    Bilgileri Kaydet
                  </button>
                ) : (
                  <button
                    className="flex flex-row-reverse bg-gray-900 hover:bg-blue-500 ease-in duration-300 text-white text-lg mx-auto p-5 rounded-lg"
                    type="button"
                  >
                    Bilgileri Güncelle
                  </button>
                )}
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
}

export default AddEndUserModal;
