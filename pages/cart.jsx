import React, {Fragment, useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {
    cart,
    cartDetail,
    cartDetailDiscountTotal,
    cartDetailSubTotal,
    cartLength,
    partners
} from "../atoms/shoppingCartAtom";
import {toast} from "react-toastify";
import PostData from "../utility/HttpPostUtility";
import addRandomLicenseKey from "../utility/RandomLicenseKeyObject";
import {db} from '../firebase/index';
import {addDoc, collection} from "firebase/firestore";
import mergeJSONObjects from "../utility/MergeJSONObjects";
import {licenses} from "../atoms/fireStoreDataAtom";
import Select from "react-select";
import Navbar from "../components/Navbar";
import {useRouter} from "next/router";
import Head from "next/head";
import {RiDeleteBin5Line} from "react-icons/ri";
import {getPartners} from "./api/getpartners";
import EndUserModal from "../components/EndUserModal";
import {AiOutlineEye} from "react-icons/ai";

const Cart = (props) => {

    const [orderDetails, setOrderDetails] = useState(null);
    const subTotal = useRecoilValue(cartDetailSubTotal);
    const discountTotal = useRecoilValue(cartDetailDiscountTotal);
    const cartLengthState = useRecoilValue(cartLength);
    const [subTotals, setSubTotals] = useState(null);
    const [cartLenghtStates, setCartLength] = useState(null);
    const [discountTotals, setDiscountTotals] = useState(null);
    const [cartState, setCartState] = useRecoilState(cart);
    const [cartDetailState, setDetailCartState] = useRecoilState(cartDetail);
    const [license, setLicenseState] = useRecoilState(licenses);
    const [openEndUserModal, setOpenEndUserModal] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0)
    const router = useRouter()
    const showEndUserModal = (index) => {
        setSelectedIndex(index)
        setOpenEndUserModal(!openEndUserModal);
    }
    console.log('cart')

    useEffect(() => {
        if (cartLengthState === 0)
            router.push('/dashboard')

        console.log('use effect')
        setSubTotals(subTotal)
        setDiscountTotals(discountTotal)
        setCartLength(cartLengthState)
        setOrderDetails(cartState.map((item, index) => {
            return (
                <tr key={index}>
                    <td className="text-center">{item.Type === 'NewLicense' ? cartDetailState[index]?.Items[0].ResellerName

                        : (
                            <Fragment>
                                <Select options={props.options}
                                        className="w-auto"
                                        isLoading={false}
                                        isClearable={true}
                                        noOptionsMessage={() => "Uygun kayıt bulunamadı!"}
                                        placeholder="Bayi seçimi yapınız"
                                        onChange={(data, opt) => {

                                            setDetailCartState((prevCartDetail) => {
                                                const newCartDetail = [...prevCartDetail];
                                                newCartDetail[index] = {
                                                    ...newCartDetail[index],
                                                    Items: [
                                                        {
                                                            ...newCartDetail[index].Items[0],
                                                            ResellerName: data?.label,
                                                            ResellerId: data?.value,

                                                        },
                                                    ],
                                                };
                                                return newCartDetail;
                                            });
                                        }}>
                                </Select>
                            </Fragment>
                        )

                    }</td>
                    <td className="p-4 px-6 flex justify-center">
                        <button onClick={() => {
                            showEndUserModal(index)
                        }}><AiOutlineEye className="w-7 h-7 text-red-500"/></button>
                    </td>
                    <td className="p-4 px-6 text-center">
                        <div className="flex flex-col items-center justify-center">
                            <h3>{item.Type === 'NewLicense' ? item.Edition : item.Type === 'RenewAnnual' ? cartDetailState[index]?.Items[0].LicenseKeys[0].Edition : getLicenseTypeAndSimcalls(cartDetailState[index]?.Items[0]?.ProductDescription)?.licenseType}</h3>
                        </div>
                    </td>
                    <td className="p-4 px-6 text-center whitespace-nowrap">
                        <div className="flex flex-col items-center justify-center">
                            <h3>{item.Type === 'NewLicense' ? 'Yeni Lisans' : item.Type === 'RenewAnnual' ? 'Lisans Yenileme' : 'Lisans Yükseltme'}</h3>
                        </div>
                    </td>
                    <td className="p-4 px-6 text-center whitespace-nowrap">{item.Type === 'NewLicense' ? item.SimultaneousCalls : item.Type === 'RenewAnnual' ? cartDetailState[index]?.Items[0].LicenseKeys[0].SimultaneousCalls : getLicenseTypeAndSimcalls(cartDetailState[index]?.Items[0]?.ProductDescription)?.simCall}</td>
                    <td className="p-4 px-6 text-center whitespace-nowrap">{item.Type === 'Upgrade' ? 1 : item.Quantity}</td>
                    <td className="p-4 px-6 text-center whitespace-nowrap">{item.Type !== 'NewLicense' ? 0 : item.AdditionalInsuranceYears}</td>
                    <td className="p-4 px-6 text-center whitespace-nowrap">${cartDetailState[index]?.Items[0].UnitPrice * cartDetailState[index]?.Items[0].Quantity}</td>
                    <td className="p-4 px-6 text-center whitespace-nowrap">
                        <button onClick={async () => {
                            const updatedCartState = [...cartState];
                            updatedCartState.splice(index, 1);
                            setCartState(updatedCartState)

                            const updatedDetailCartState = [...cartDetailState];
                            updatedDetailCartState.splice(index, 1);
                            setDetailCartState(updatedDetailCartState)
                            toast.error('Ürün sepetten çıkarıldı', {
                                position: "top-center",
                                autoClose: 2000,
                                hideProgressBar: false,
                                closeOnClick: true,
                                pauseOnHover: true,
                                draggable: true,
                                progress: undefined,
                                theme: "dark",
                            });
                        }
                        }>
                            <RiDeleteBin5Line className="w-5 h-5 text-red-500"/>
                        </button>
                    </td>
                </tr>
            );
        }))

    }, [cartDetailState]);

    const getLicenseTypeAndSimcalls = (param) => {
        if (param === undefined)
            return

        const elementToSplit = param.split('\n')[1];
        // Use the match method to extract the values
        const [, , , , type, simcall] = elementToSplit.match(/\w+/g);

        return {
            licenseType: type,
            simCall: simcall
        }
    }
    const CompleteOrder = async (props) => {


        const postData = {
            PO: "MYPO123",
            SalesCode: "",
            Notes: "",
            Lines: cartState
        };


        try {
            const tcxResponses = await PostData('/api/newlicense', JSON.stringify(postData));
            addRandomLicenseKey(tcxResponses)

            toast.success('Sipariş başarıyla oluşturuldu.', {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });

            mergeJSONObjects(cartDetailState, tcxResponses);

            await addDoc(collection(db, "licenses"), {tcxResponses});
            //refresh firestore data
            const firestoreData = await fetch('/api/getfirestoredata');
            const data = await firestoreData.json();
            setLicenseState(data)
            setCartState([]);
            setDetailCartState([])

        } catch (error) {
            console.error(error);
        }

    };

    const CompleteOrderTest = async () => {

        var jsonObjectwithoutLicenseKeys = {
            "UniqueId": null,
            "TrackingCode": null,
            "Currency": "USD",
            "AdditionalDiscountPerc": 0,
            "AdditionalDiscount": 0.00,
            "SubTotal": 327.25,
            "TaxPerc": 0.00,
            "Tax": 0.00,
            "GrandTotal": 327.25,
            "Items": [
                {
                    "Line": 1,
                    "Type": "NewLicense",
                    "ProductCode": "3CXPSPROFSPLA",
                    "SKU": "3CXNAP16M12",
                    "ProductName": "3CX Phone System Professional - Annual",
                    "ProductDescription": "3CX Phone System Professional 16 SC\nincl. 12 month maintenance\nFor: Pro-Sistem Bilgisayar\nSKU: 3CXNAP16M12",
                    "UnitPrice": 595.00,
                    "Discount": 45.0,
                    "Quantity": 3,
                    "Net": 327.25,
                    "Tax": 0.00,
                    "ResellerId": "219991",
                    "ResellerPrice": 446.25,
                    "PrivateKeyPassword": null,
                    "LicenseKeys": []
                }
            ]
        }


        addRandomLicenseKey(jsonObjectwithoutLicenseKeys)

        // const filteredJson = {
        //     Items: jsonObjectwithoutLicenseKeys.Items.map(item => ({
        //         ResellerName: item.ProductDescription.split('For:')[1].split('\n')[0].trim(),
        //         LicenseKeys: item.LicenseKeys.map(licenseKey => ({
        //             LicenseKey: licenseKey.LicenseKey,
        //             SimultaneousCalls: licenseKey.SimultaneousCalls,
        //             Edition: licenseKey.Edition
        //         })),
        //         ResellerId: item.ResellerId
        //     }))
        // };
        //
        // const now = new Date();
        // const datetime = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
        // filteredJson.Items.forEach(item => {
        //     item.LicenseKeys.forEach(licenseKey => {
        //         console.log(`${datetime} - ${item.ResellerName},${licenseKey.Edition},${licenseKey.SimultaneousCalls},${licenseKey.LicenseKey}`);
        //     });
        // });

        //  return filteredJson;


    }

    return (

        <div className="bg-gray-900 h-screen">
            <Navbar/>
            <EndUserModal selectedIndex={selectedIndex} showModal={openEndUserModal} closeModal={showEndUserModal}/>
            <Head>
                <title>Sipariş Detayları</title>
                <meta name="description" content="3CX Order License"/>
            </Head>
            <div>
                <div className="container mx-auto w-full bg-white p-5 mt-5 shadow-lg rounded-lg">
                    <div className="my-2">
                        <h3 className="text-xl font-bold tracking-wider">Sipariş Detayları</h3>
                    </div>
                    <table className="table-auto w-full">
                        <thead>
                        <tr className="bg-gray-100">
                            <th className="px-6 py-3 font-bold w-1/4">Bayi</th>
                            <th className="px-6 py-3 font-bold whitespace-nowrap">End User</th>
                            <th className="px-6 py-3 font-bold whitespace-nowrap">Lisans Tipi</th>
                            <th className="px-6 py-3 font-bold whitespace-nowrap">İşlem</th>
                            <th className="px-6 py-3 font-bold whitespace-nowrap">Kanal Sayısı</th>
                            <th className="px-6 py-3 font-bold whitespace-nowrap">Adet</th>
                            <th className="px-6 py-3 font-bold whitespace-nowrap">Ek (Yıl)</th>
                            <th className="px-6 py-3 font-bold whitespace-nowrap">Fiyat</th>
                            <th className="px-6 py-3 font-bold whitespace-nowrap">Ürün Sil</th>
                        </tr>
                        </thead>
                        <tbody className="w-full">
                        {orderDetails}
                        </tbody>
                    </table>

                    <div className="mt-4">
                        <div className="py-4 rounded-md shadow">
                            <h3 className="text-xl font-bold text-blue-600">Sipariş Özeti</h3>
                            <div className="flex justify-between px-4">
                                <span className="font-bold">Ara Toplam</span>
                                <span className="font-bold">${subTotals}</span>
                            </div>
                            <div className="flex justify-between px-4">
                                <span className="font-bold">İndirim</span>
                                <span className="font-bold text-red-600">- {discountTotals}$</span>
                            </div>

                            <div
                                className="
                flex
                items-center
                justify-between
                px-4
                py-2
                mt-3
                border-t-2
              "
                            >
                                <span className="text-xl font-bold">Toplam</span>
                                <span className="text-2xl font-bold">${subTotals - discountTotals}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row-reverse mt-4">
                        <button onClick={CompleteOrder}
                                className="

              p-4
              text-center text-white
              bg-gray-900
              rounded-md
              shadow
              hover:bg-blue-500 ease-in duration-300
            ">
                            Siparişi Tamamla
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Cart;

export async function getServerSideProps(context) {

    const response = await getPartners()
    //const options = []
    //Extract only the PartnerId and CompanyName fields from each object in the array
    const options = response.map(partner => ({
            value: partner.PartnerId,
            label: `${partner.CompanyName} (${partner.PartnerLevelName})`,
        })
    );

    return {
        props: {options}, // will be passed to the page component as props
    }
}