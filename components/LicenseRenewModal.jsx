import React, {Fragment, useEffect, useState} from 'react';
import {Modal} from "flowbite-react";
import {GrLicense} from "react-icons/gr";
import {TbLicense, TbSquareMinus, TbSquarePlus} from "react-icons/tb";
import PostData from "../utility/HttpPostUtility";
import {toast} from "react-toastify";
import {useRecoilState} from "recoil";
import {cart, cartDetail} from "../atoms/shoppingCartAtom";


const LicenseRenewModal = props => {

    const [showLicenseCard, setShowLicenseCard] = useState(false);
    const [years, setYears] = useState(1);
    const [licenseKey, setLicenseKey] = useState('');
    const [licenseKeyData, setLicenseKeyData] = useState(null);
    const [formattedLicenseKey, setFormattedLicenseKey] = useState('');
    const [cartState, setCartState] = useRecoilState(cart);
    const [cartDetailState, setDetailCartState] = useRecoilState(cartDetail);

    useEffect(() => {
        // Update formattedLicenseKey when licenseKey changes
        setFormattedLicenseKey(
            licenseKey.replace(/([^-]{4})(?=[^-])/g, '$1-') // Add new hyphens after every fourth character that is not already a hyphen
        );

    }, [licenseKey]);

    useEffect(() => {
        if (licenseKey.length === 16) {
            const fetchData = async () => {
                const response = await getRenewLicenseData(formattedLicenseKey, years)
                if (response.status === 200) {
                    const json = await response.json();
                    setLicenseKeyData(json)
                    setShowLicenseCard(true)
                } else {
                    setShowLicenseCard(false)
                    setLicenseKeyData(undefined)
                }
            }
            fetchData()
            console.log(licenseKeyData)
        } else {
            setShowLicenseCard(false)
            setLicenseKeyData(undefined)
        }
    }, [formattedLicenseKey]);

    const addCart = async () => {

        const renewAnnual = {
            "Type": "RenewAnnual",
            "UpgradeKey": formattedLicenseKey,
            "Quantity": years,
            "ResellerId": null
        }

        setCartState([...cartState, renewAnnual]);
        const res = await PostJsonData(renewAnnual);
        res.Items[0].endUser='';
        res.Items[0].ResellerName='';
        setDetailCartState([...cartDetailState, res]);

        toast.info('Ürün sepete eklendi.', {
            position: "top-center",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });

    }

    const PostJsonData = async (data) => {

        const postData = {
            PO: "MYPO123",
            SalesCode: "",
            Notes: "",
            //Lines: [data]
            Lines:[data]
        };


        try {
            const responseData = await PostData('/api/newlicense', JSON.stringify(postData));
            console.log(responseData);
            return responseData;
        } catch (error) {
            console.error(error);
        }
    }

    const getRenewLicenseData = async (lic, year) => {
        const response = await fetch(`/api/renew/${lic}/${year}`)
        return response
    }
    const handleLicenseKeyChange = async (event) => {
        let value = event.target.value;
        // Only allow digits, letters, and hyphens
        if (/^[0-9A-Za-z-]*$/.test(value)) {
            // Limit the length of the value to 16 characters, excluding hyphens
            value = value.replace(/-/g, '').slice(0, 16);

            // Make the value uppercase
            value = value.toUpperCase();
            setLicenseKey(value);
        }


    };

    const closeModal = () => {
        setLicenseKey('')
        setLicenseKeyData(undefined)
        props.closeModal()
    }
    return (
        <Fragment>
            <Modal
                show={props.showModal}
                size="lg"
                popup={true}
                onClose={() => closeModal()}>
                <Modal.Header/>
                <Modal.Body>

                    <form className="flex flex-col justify-center">
                        <label className="block text-gray-700 text-md text-center font-bold mb-2" htmlFor="select1">
                            Lisans Yenileme
                        </label>
                        <label className="text-md font-medium">Lisans Anahtarı</label>

                        <label className="relative block mb-2">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                <GrLicense className="h-5 w-5"/>

  </span>
                            <input
                                className="placeholder:text-slate-400 block bg-white w-full border border-slate-300 rounded-md py-2 pl-9 pr-3 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm"
                                placeholder="Lisans anahtarını giriniz..." type="text" name="licenseKey"
                                type="text"
                                value={formattedLicenseKey}
                                onChange={handleLicenseKeyChange}/>
                        </label>
                        {
                            showLicenseCard && (
                                <Fragment>
                                    <div className="flex justify-between items-center mb-3">
                                        <div className="inline-flex items-center self-start">

                                            <TbLicense
                                                className="h-8 w-8 mr-2 bg-gradient-to-r from-pink-600 to-red-600 shadow-lg rounded p-1.5 text-gray-100"/>
                                            <span
                                                className="font-bold text-gray-900">{licenseKeyData && `${licenseKeyData.Edition} Sürüm / ${licenseKeyData.SimultaneousCalls} Kanal`}</span>
                                        </div>
                                        <div className="flex">
                                            <button type="button"
                                                    className="bg-yellow-600 p-1.5 font-bold rounded w-10 h-10"
                                                    onClick={() => setYears(years > 1 ? years - 1 : years)}>
                                                -
                                            </button>
                                            <input id="item_count" type="number" value="1" className="max-w-[100px] font-bold py-1.5 px-2 mx-1.5
            block border border-gray-300 rounded-md text-sm shadow-sm  placeholder-gray-400 text-center
            focus:outline-none
            focus:border-sky-500
            focus:ring-1
            focus:ring-sky-500
            focus:invalid:border-red-500  focus:invalid:ring-red-500" disabled={true} min={1} max={5} value={years}/>

                                            <button type="button"
                                                    className="bg-green-600 p-1.5 font-bold rounded w-10 h-10"
                                                    onClick={() => setYears(years < 5 ? years + 1 : years)}>
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => addCart()}
                                        className="px-4 py-1.5 rounded-md shadow-lg bg-gradient-to-r from-pink-600 to-red-600 font-medium text-gray-100 block transition duration-300"
                                        type="button">
                                        Sepete Ekle
                                    </button>
                                </Fragment>)
                        }

                    </form>

                </Modal.Body>
            </Modal>
        </Fragment>
    );
};

export default LicenseRenewModal;