import React, { Fragment, useEffect, useState, useRef } from "react";
import { Modal } from "flowbite-react";
import Select from "react-select";
import PostData from "../utility/HttpPostUtility";
import { useRecoilState } from "recoil";
import { cart, cartDetail, partners } from "../atoms/shoppingCartAtom";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import { RadioGroup } from "@headlessui/react";
import CustomSelect from "./Helpers/CustomSelect";
import { useFormik } from "formik";
import * as yup from "yup";
import { Alert, AlertIcon } from "@chakra-ui/react";
const editionOption = [{ name: "Professional" }, { name: "Enterprise" }];

const BuyLicenseModal = (props) => {
  const [quantity, setQuantity] = useState(1);
  const [isForwardCart, setForwardCart] = useState(false);
  const [additionalYear, setAdditionalYear] = useState(0);
  const [simCall, setSimCall] = useState(4);
  const [cartState, setCartState] = useRecoilState(cart);
  const [cartDetailState, setDetailCartState] = useRecoilState(cartDetail);
  const [getPartners, setPartners] = useRecoilState(partners);
  const [options, setOptions] = useState([]);
  const [edition, setEdition] = useState(editionOption[0].name);
  const selectInputRef = useRef();

  const router = useRouter();
  useEffect(() => {
    const getPartners = async () => {
      const response = await fetch("/api/getpartners");
      const data = await response.json();

      // Extract only the PartnerId and CompanyName fields from each object in the array
      const filteredData = data.map((partner) => ({
        value: partner.PartnerId,
        label: `${partner.CompanyName} (${partner.PartnerLevelName} %${partner.DiscountPercent})`,
      }));
      setOptions(filteredData);
      setPartners(data); // Update the options state with the filtered data
    };
    getPartners();
  }, []); // Call the getPartners function only once when the component mounts

  // ----------------- Helper function to join class names -----------------
  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  const closeModal = () => {
    props.closeModal();
  };

  const validationSchema = yup.object().shape({
    partners: yup.string().required("Bayi zorunlu alandır!"),
  });

  const formik = useFormik({
    validationSchema,
    initialValues: { partners: undefined },
    onSubmit: (values) => {
      if (formik.isValid) {
        if (isForwardCart) router.push("/cart");
        addLine();
        formik.resetForm();
        setForwardCart(false);
      }
    },
  });
  async function addLine() {
    const newLine = {
      Type: "NewLicense",
      Edition: edition,
      SimultaneousCalls: parseInt(simCall, 10),
      Quantity: parseInt(quantity, 10),
      AdditionalInsuranceYears: parseInt(additionalYear, 10),
      ResellerId: formik.values.partners,
      AddHosting: false,
    };

    // storeWithObject.addLine(prevLines => [...prevLines, ...newLine])
    setCartState([...cartState, newLine]);
    const res = await PostJsonData(newLine);
    res.Items[0].endUser = {};
    res.Items[0].ResellerName = res.Items[0].ProductDescription.split("For:")[1]
      .split("\n")[0]
      .trim();
    setDetailCartState([...cartDetailState, res]);
    selectInputRef.current.clearValue();
    setQuantity(1);
    setAdditionalYear(0);
    setSimCall(8);
    setEdition("Professional");

    toast.info("Ürün sepete eklendi.", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    // SetLines(prevLines => [...prevLines, ...newLine]);
  }

  const PostJsonData = async (data) => {
    const postData = {
      PO: "MYPO123",
      SalesCode: "",
      Notes: "",
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
          <h1 className="grid border border-b-3 border-b-blue-600 justify-center pb-2 pt-2 shadow-2xl">
            YENİ LİSANS
          </h1>

          <form
            onSubmit={formik.handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <label
              className="block text-gray-700 text-sm font-bold mb-2 mt-2"
              htmlFor="select3"
            >
              Bayi Seçimi
            </label>
            <CustomSelect
              name="partners"
              options={options}
              ref={selectInputRef}
              onBlur={() => {
                formik.handleBlur({ target: { name: "partners" } });
              }}
              onChange={(option) => {
                formik.setFieldValue("partners", option?.value);
              }}
            />
            {formik.errors.partners && formik.touched.partners ? (
              <Alert status="error">
                <AlertIcon />
                {formik.errors.partners}
              </Alert>
            ) : null}
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="select1"
              >
                Lisans Tipi
              </label>

              <RadioGroup
                value={edition}
                onChange={setEdition}
                className="mt-2"
              >
                <div className="grid grid-cols-3 gap-1 sm:grid-cols-6 space-x-20">
                  {editionOption.map((option) => (
                    <RadioGroup.Option
                      key={option.name}
                      value={option.name}
                      className={({ active, checked }) =>
                        classNames(
                          active ? "ring-2 ring-offset-2 ring-indigo-500" : "",
                          checked
                            ? "bg-indigo-600 border-transparent text-white hover:bg-indigo-700"
                            : "bg-white border-gray-200 text-gray-900 hover:bg-gray-50",
                          "border rounded-md py-3 px-3 flex items-center justify-center text-sm font-small w-40 uppercase sm:flex-1"
                        )
                      }
                    >
                      <RadioGroup.Label as="p">{option.name}</RadioGroup.Label>
                    </RadioGroup.Option>
                  ))}
                </div>
              </RadioGroup>

              <label
                className="block text-gray-700 text-sm font-bold mb-2 mt-2"
                htmlFor="select2"
              >
                Kanal Sayısı
              </label>
              <div className="relative rounded-md shadow-sm">
                <select
                  id="select2"
                  className="form-select w-full px-3 py-2 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none focus:outline-none focus:shadow-outline"
                  value={simCall}
                  onChange={(event) => setSimCall(event.target.value)}
                >
                  <option value="">Kanal sayısını seçiniz</option>
                  <option value="4">4</option>
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

              <div className="mb-4 mt-2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="number1"
                >
                  Adet
                </label>
                <input
                  id="number1"
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={quantity}
                  onChange={(event) => setQuantity(event.target.value)}
                  min={1}
                  max={50}
                />
              </div>
              <div className="mb-4 mt-2">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="number2"
                >
                  Ek süre (Yıl)
                </label>
                <input
                  id="number2"
                  type="number"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={additionalYear}
                  onChange={(event) => setAdditionalYear(event.target.value)}
                  min={0}
                  max={5}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                // onClick={addLine}
                className="bg-indigo-500 w-full hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                type="submit"
              >
                SEPETE EKLE
              </button>
              <button
                onClick={() => {
                  formik.handleSubmit();
                  if (formik.isValid && formik.dirty) setForwardCart(true);
                }}
                className="bg-indigo-500 w-full hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
              >
                SEPETE EKLE/GİT
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </Fragment>
  );
};

export default BuyLicenseModal;
