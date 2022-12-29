import {Modal, Table} from "flowbite-react";
import React, {Fragment, useState} from "react";
import {useRecoilState, useRecoilValue} from "recoil";
import {cart, cartDetail, cartDetailDiscountTotal, cartDetailSubTotal} from "../atoms/shoppingCartAtom";
function OrderDetailsModal(props) {

    const [cartState,setCartState] = useRecoilState(cart);
    const [cartDetailState,setDetailCartState] = useRecoilState(cartDetail);
    const subTotal = useRecoilValue(cartDetailSubTotal);
    const discountTotal = useRecoilValue(cartDetailDiscountTotal);
    const orderDetails = cartState.map((item,index) => {
        return (
            <tr key={index}>
                <td className="p-4 px-6 text-center whitespace-nowrap">{item.ResellerId}</td>
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
                    <button onClick={()=> {
                        const updatedCartState = [...cartState];
                        updatedCartState.splice(index, 1);
                        setCartState(updatedCartState)

                        const updatedDetailCartState = [...cartDetailState];
                        updatedDetailCartState.splice(index, 1);
                        setDetailCartState(updatedDetailCartState)

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
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Lisans Tipi</th>
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Kanal Sayısı</th>
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Adet</th>
                                    <th className="px-6 py-3 font-bold whitespace-nowrap">Ek süre (Yıl)</th>
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
                                        <span className="text-2xl font-bold">${subTotal-discountTotal}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4">
                                <button
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
