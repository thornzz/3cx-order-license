import {Modal} from "flowbite-react";
import React, {Fragment, useEffect, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {cart, cartDetail, cartDetailDiscountTotal, cartDetailSubTotal, cartLength} from "../atoms/shoppingCartAtom";
import {toast} from "react-toastify";
import PostData from "../utility/HttpPostUtility";
import addRandomLicenseKey from "../utility/RandomLicenseKeyObject";
import {db} from '../firebase/index';
import {addDoc, collection} from "firebase/firestore";
import mergeJSONObjects from "../utility/MergeJSONObjects";

function OrderDetailsModal(props) {

    const [cartState, setCartState] = useRecoilState(cart);
    const [cartDetailState, setDetailCartState] = useRecoilState(cartDetail);
    const subTotal = useRecoilValue(cartDetailSubTotal);
    const cartLengthState = useRecoilValue(cartLength);
    const discountTotal = useRecoilValue(cartDetailDiscountTotal);





    const CompleteOrder = async () => {


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
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
            // const addtoFirestoreData = {
            //     Items: responseData.Items.map(item => ({
            //         ResellerName: item.ProductDescription.split('For:')[1].split('\n')[0].trim(),
            //         ResellerId:item.ResellerId,
            //         Date:new Date(),
            //         LicenseKeys: item.LicenseKeys.map(licenseKey => ({
            //             LicenseKey: licenseKey.LicenseKey,
            //             SimultaneousCalls: licenseKey.SimultaneousCalls,
            //             Edition: licenseKey.Edition
            //         })),
            //     }))
            // };


            mergeJSONObjects(cartDetailState, tcxResponses);
            console.log(tcxResponses)
            //const now = new Date();
            //const datetime = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;

            await addDoc(collection(db, "licenses"), {tcxResponses});

            // addtoFirestoreData.Items.forEach(item => {
            //     item.LicenseKeys.forEach(licenseKey => {
            //
            //         console.log(`${datetime} - ${item.ResellerName},${licenseKey.Edition},${licenseKey.SimultaneousCalls},${licenseKey.LicenseKey}`);
            //     });
            // });

            setCartState([]);
            setDetailCartState([])
            props.closeModal()

        } catch (error) {
            console.error(error);
        }

    };

    const CompleteOrderTest = async () => {

        // var jsonObjwithLicenseKeys = {
        //     "UniqueId": null,
        //     "TrackingCode": 454975195,
        //     "Currency": "USD",
        //     "AdditionalDiscountPerc": 0.0000,
        //     "AdditionalDiscount": 0.00,
        //     "SubTotal": 2629.00,
        //     "TaxPerc": 0.00,
        //     "Tax": 0.00,
        //     "GrandTotal": 2629.0000,
        //     "Items": [
        //         {
        //             "Line": 1,
        //             "Type": "NewLicense",
        //             "ProductCode": "3CXPSPROFSPLA",
        //             "SKU": "3CXNAP32M12",
        //             "ProductName": "3CX Phone System Professional - Annual",
        //             "ProductDescription": "3CX Phone System Professional 32 SC\nincl. 12 month maintenance\nFor: Sezyum Bilgi Teknolojileri Ltd. Sti.\nSKU: 3CXNAP32M12",
        //             "UnitPrice": 1195.0000,
        //             "Discount": 45.0,
        //             "Quantity": 4,
        //             "Net": 2629.00,
        //             "Tax": 0.00,
        //             "ResellerId": "234161",
        //             "ResellerPrice": 3346.00,
        //             "PrivateKeyPassword": null,
        //             "LicenseKeys": [
        //                 {
        //                     "LicenseKey": "9S9X-RZOE-WSSS-RFVC",
        //                     "SimultaneousCalls": 32,
        //                     "IsPerpetual": false,
        //                     "Edition": "Professional",
        //                     "ExpiryIncludedMonths": 12,
        //                     "ExpiryDate": null,
        //                     "MaintenanceIncludedMonths": 12,
        //                     "MaintenanceDate": null,
        //                     "HostingIncludedMonths": null,
        //                     "HostingExpiry": null
        //                 },
        //                 {
        //                     "LicenseKey": "BBIW-OYOJ-KB33-3A8X",
        //                     "SimultaneousCalls": 32,
        //                     "IsPerpetual": false,
        //                     "Edition": "Professional",
        //                     "ExpiryIncludedMonths": 12,
        //                     "ExpiryDate": null,
        //                     "MaintenanceIncludedMonths": 12,
        //                     "MaintenanceDate": null,
        //                     "HostingIncludedMonths": null,
        //                     "HostingExpiry": null
        //                 },
        //                 {
        //                     "LicenseKey": "VXVZ-IWMI-H6C3-FH68",
        //                     "SimultaneousCalls": 32,
        //                     "IsPerpetual": false,
        //                     "Edition": "Professional",
        //                     "ExpiryIncludedMonths": 12,
        //                     "ExpiryDate": null,
        //                     "MaintenanceIncludedMonths": 12,
        //                     "MaintenanceDate": null,
        //                     "HostingIncludedMonths": null,
        //                     "HostingExpiry": null
        //                 },
        //                 {
        //                     "LicenseKey": "EE4O-H7SO-LGJV-K2DO",
        //                     "SimultaneousCalls": 32,
        //                     "IsPerpetual": false,
        //                     "Edition": "Professional",
        //                     "ExpiryIncludedMonths": 12,
        //                     "ExpiryDate": null,
        //                     "MaintenanceIncludedMonths": 12,
        //                     "MaintenanceDate": null,
        //                     "HostingIncludedMonths": null,
        //                     "HostingExpiry": null
        //                 }
        //             ]
        //         },
        //         {
        //             "Line": 2,
        //             "Type": "NewLicense",
        //             "ProductCode": "3CXPSPROFSPLA",
        //             "SKU": "3CXNAP32M12",
        //             "ProductName": "3CX Phone System Professional - Annual",
        //             "ProductDescription": "3CX Phone System Professional 32 SC\nincl. 12 month maintenance\nFor: Avencom Ltd. Sti.\nSKU: 3CXNAP32M12",
        //             "UnitPrice": 1195.0000,
        //             "Discount": 45.0,
        //             "Quantity": 4,
        //             "Net": 2629.00,
        //             "Tax": 0.00,
        //             "ResellerId": "234165",
        //             "ResellerPrice": 3346.00,
        //             "PrivateKeyPassword": null,
        //             "LicenseKeys": [
        //                 {
        //                     "LicenseKey": "9S9X-RZOE-WSSS-HB2C",
        //                     "SimultaneousCalls": 32,
        //                     "IsPerpetual": false,
        //                     "Edition": "Professional",
        //                     "ExpiryIncludedMonths": 12,
        //                     "ExpiryDate": null,
        //                     "MaintenanceIncludedMonths": 12,
        //                     "MaintenanceDate": null,
        //                     "HostingIncludedMonths": null,
        //                     "HostingExpiry": null
        //                 },
        //                 {
        //                     "LicenseKey": "BBIW-OYOJ-KB33-HB3C",
        //                     "SimultaneousCalls": 32,
        //                     "IsPerpetual": false,
        //                     "Edition": "Professional",
        //                     "ExpiryIncludedMonths": 12,
        //                     "ExpiryDate": null,
        //                     "MaintenanceIncludedMonths": 12,
        //                     "MaintenanceDate": null,
        //                     "HostingIncludedMonths": null,
        //                     "HostingExpiry": null
        //                 },
        //                 {
        //                     "LicenseKey": "VXVZ-IWMI-H6C3-HB4C",
        //                     "SimultaneousCalls": 32,
        //                     "IsPerpetual": false,
        //                     "Edition": "Professional",
        //                     "ExpiryIncludedMonths": 12,
        //                     "ExpiryDate": null,
        //                     "MaintenanceIncludedMonths": 12,
        //                     "MaintenanceDate": null,
        //                     "HostingIncludedMonths": null,
        //                     "HostingExpiry": null
        //                 },
        //                 {
        //                     "LicenseKey": "EE4O-H7SO-LGJV-DOA5",
        //                     "SimultaneousCalls": 32,
        //                     "IsPerpetual": false,
        //                     "Edition": "Professional",
        //                     "ExpiryIncludedMonths": 12,
        //                     "ExpiryDate": null,
        //                     "MaintenanceIncludedMonths": 12,
        //                     "MaintenanceDate": null,
        //                     "HostingIncludedMonths": null,
        //                     "HostingExpiry": null
        //                 }
        //             ]
        //         }
        //
        //     ]
        // }

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

    const orderDetails = cartState.map((item, index) => {


        return (
            <tr key={index}>
                <td className="p-4 px-6 text-center whitespace-nowrap">{cartDetailState[index]?.Items[0].ResellerName}</td>
                <td className="p-4 px-6 text-center whitespace-nowrap">{cartDetailState[index]?.Items[0].endUser}</td>
                <td className="p-4 px-6 text-center whitespace-nowrap">
                    <div className="flex flex-col items-center justify-center">
                        <h3>{item.Edition}</h3>
                    </div>
                </td>
                <td className="p-4 px-6 text-center whitespace-nowrap">{item.SimultaneousCalls}</td>
                <td className="p-4 px-6 text-center whitespace-nowrap">{item.Quantity}</td>
                <td className="p-4 px-6 text-center whitespace-nowrap">{item.AdditionalInsuranceYears}</td>
                <td className="p-4 px-6 text-center whitespace-nowrap">${cartDetailState[index]?.Items[0].UnitPrice * cartDetailState[index]?.Items[0].Quantity}</td>
                <td className="p-4 px-6 text-center whitespace-nowrap">
                    <button onClick={() => {
                        const updatedCartState = [...cartState];
                        updatedCartState.splice(index, 1);
                        setCartState(updatedCartState)

                        const updatedDetailCartState = [...cartDetailState];
                        updatedDetailCartState.splice(index, 1);
                        setDetailCartState(updatedDetailCartState)
                        toast.error('Ürün sepetten çıkarıldı', {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "dark",
                        });
                        if (cartLengthState === 1) props.closeModal()
                    }
                    }>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-6 h-6 text-red-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                        </svg>
                    </button>
                </td>
            </tr>
        );
    });

    return (
        <Fragment>
            <Modal
                show={props.showModal}
                size="6xl"
                popup={true}
                onClose={() => props.closeModal()}>
                <Modal.Header/>
                <Modal.Body>
                    <div className="container mx-auto">
                        <div className="w-full overflow-x-auto">
                            <div className="my-2">
                                <h3 className="text-xl font-bold tracking-wider">Sipariş Detayları</h3>
                            </div>
                            <table className="w-full shadow-inner">
                                <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Bayi</th>
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">End User</th>
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Lisans Tipi</th>
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Kanal Sayısı</th>
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Adet</th>
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Ek (Yıl)</th>
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Fiyat</th>
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Ürün Sil</th>
                                </tr>
                                </thead>
                                <tbody>
                                {orderDetails}
                                </tbody>
                            </table>

                            <div className="mt-4">
                                <div className="py-4 rounded-md shadow">
                                    <h3 className="text-xl font-bold text-blue-600">Sipariş Özeti</h3>
                                    <div className="flex justify-between px-4">
                                        <span className="font-bold">Ara Toplam</span>
                                        <span className="font-bold">${subTotal}</span>
                                    </div>
                                    <div className="flex justify-between px-4">
                                        <span className="font-bold">İndirim</span>
                                        <span className="font-bold text-red-600">- ${discountTotal}</span>
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
                                        <span className="text-2xl font-bold">${subTotal - discountTotal}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button onClick={CompleteOrder}
                                        className="
              w-full
              py-2
              text-center text-white
              bg-blue-500
              rounded-md
              shadow
              hover:bg-blue-600
            "
                                >
                                    Siparişi Tamamla
                                </button>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Fragment>
    );
}

export default OrderDetailsModal;
