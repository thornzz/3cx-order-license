import React, {Fragment, useEffect, useState} from 'react';
import {Modal} from "flowbite-react";
import Select from 'react-select'
import PostData from "../utility/HttpPostUtility";
import {useRecoilState} from "recoil";
import {cart, cartDetail} from "../atoms/shoppingCartAtom";

const BuyLicenseModal = (props) => {

    const [quantity, setQuantity] = useState(0)
    const [partnerId, setPartnerId] = useState('')
    const [endUser, setEndUser] = useState('')
    const [additionalYear, setAdditionalYear] = useState(0)
    const [licenseType, setLicenseType] = useState('')
    const [simCall, setSimCall] = useState(0)
    const [options, setOptions] = useState([]);
    const [cartState, setCartState] = useRecoilState(cart);
    const [cartDetailState, setDetailCartState] = useRecoilState(cartDetail);

    useEffect(() => {
        const getPartners = async () => {
            const response = await fetch('/api/getpartners');
            const data = await response.json();

            // Extract only the PartnerId and CompanyName fields from each object in the array
            const filteredData = data.map(partner => ({
                    value: partner.PartnerId,
                    label: partner.CompanyName,
                })
            );

            setOptions(filteredData); // Update the options state with the filtered data
        }

        getPartners();
    }, []); // Call the getPartners function only once when the component mounts

    async function addLine() {

        const newLine = {
            Type: "NewLicense",
            Edition: licenseType,
            SimultaneousCalls: parseInt(simCall, 10),
            Quantity: parseInt(quantity, 10),
            AdditionalInsuranceYears: parseInt(additionalYear, 10),
            ResellerId: partnerId,
            AddHosting: false
        }

        // storeWithObject.addLine(prevLines => [...prevLines, ...newLine])
        setCartState([...cartState, newLine]);
        const res = await PostJsonData(newLine);
console.log(JSON.stringify(res));
        setDetailCartState([...cartDetailState, res]);
        // SetLines(prevLines => [...prevLines, ...newLine]);
    }

    const PostJsonData = async (data) => {

        const postData = {
            PO: "MYPO123",
            SalesCode: "",
            Notes: "",
            Lines: [data]
        };

        try {
            const responseData = await PostData('/api/newlicense', JSON.stringify(postData));
            return responseData;
        } catch (error) {
            console.error(error);
        }
    }

    const closeModal = () => {

        props.closeModal()
    }

    return (
        <Fragment>
            <Modal
                show={props.showModal}
                size="2xl"
                popup={true}
                onClose={() => closeModal()}>
                <Modal.Header/>
                <Modal.Body>
                    <h1 className="grid border border-b-3 border-b-blue-600 justify-center pb-2 pt-2 shadow-2xl">YENİ
                        LİSANS</h1>
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">

                        <label className="block text-gray-700 text-sm font-bold mb-2 mt-2" htmlFor="select3">
                            Bayi Seçimi
                        </label>
                        <div className="relative rounded-md shadow-sm mb-2">
                            <Select options={options}
                                    isLoading={false}
                                    isClearable={true}
                                    noOptionsMessage={() => "Uygun kayıt bulunamadı!"}
                                    placeholder="Bayi seçimi yapınız"
                                    onChange={(data, opt) => {
                                        setPartnerId(data?.value)
                                    }}>
                            </Select>

                        </div>
                        <div className="mb-4 mt-2 mb-2">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="number1">
                                Son Kullanıcı (Opsiyonel)
                            </label>
                            <input
                                id="enduser"
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                value={endUser}
                                onChange={(event) => setEndUser(event.target.value)}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="select1">
                                Lisans Tipi
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <select
                                    id="select1"
                                    className="form-select w-full py-2 px-3 py-0 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none focus:outline-none focus:shadow-outline"
                                    value={licenseType}
                                    onChange={(event) => setLicenseType(event.target.value)}
                                >
                                    <option value="">Lisans Tipini Seçiniz</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Enterprise">Enterprise</option>
                                </select>
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                </div>
                            </div>

                            <label className="block text-gray-700 text-sm font-bold mb-2 mt-2" htmlFor="select2">
                                Kanal Sayısı
                            </label>
                            <div className="relative rounded-md shadow-sm">
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
                                <div
                                    className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                </div>
                            </div>

                            <div className="mb-4 mt-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="number1">
                                    Adet
                                </label>
                                <input
                                    id="number1"
                                    type="number"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={quantity}
                                    onChange={(event) => setQuantity(event.target.value)}
                                />
                            </div>
                            <div className="mb-4 mt-2">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="number2">
                                    Ek süre (Yıl)
                                </label>
                                <input
                                    id="number2"
                                    type="number"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    value={additionalYear}
                                    onChange={(event) => setAdditionalYear(event.target.value)}
                                />
                            </div>

                            {/* <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="toggle">
                                    Perpetual Lisans mı?
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <input
                                        id="toggle"
                                        type="checkbox"
                                        className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                        checked={togglePerpetual}
                                        onChange={(event) => setTogglePerpetual(event.target.checked)}
                                    />
                                </div>
                            </div> */}
                        </div>

                        <div className="flex items-center justify-between">

                            <button onClick={addLine}
                                    className="bg-indigo-500 w-full hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                    type="button"
                            >
                                SEPETE EKLE
                            </button>
                        </div>
                    </form>

                </Modal.Body>
            </Modal>
        </Fragment>

    );
};

export default BuyLicenseModal;