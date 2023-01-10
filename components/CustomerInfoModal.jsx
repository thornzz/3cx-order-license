import React, {Fragment, useEffect, useState} from 'react';
import {Modal} from "flowbite-react";
import {useRecoilState} from "recoil";
import {cartDetail} from "../atoms/shoppingCartAtom";
import {SlUser} from "react-icons/sl";
import {addDoc, collection, doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebase";
import {toast} from "react-toastify";

function CustomerInfoModal(props) {

    const [companyName, setCompanyName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [callStatus, setCallStatus] = useState('Aranacak')
    const [telephone, setTelephone] = useState('')
    const [other, setOther] = useState('')

    useEffect(() => {

        if (props.data!== undefined && props.data !== null) {

            if(props.data.customerInfo === undefined) {
                setCompanyName('')
                setAddress('')
                setEmail('')
                setTelephone('')
                setOther('')
            }
            else  {
                setCompanyName(props?.data?.customerInfo?.companyName)
                setAddress(props.data?.customerInfo?.address)
                setEmail(props.data?.customerInfo?.email)
                setTelephone(props.data?.customerInfo?.telephone)
                setOther(props.data?.customerInfo?.other)
            }

        }
    }, [props.data])
    const closeModal = () => {
        props.closeModal()
    }

    const addFirestoreCustomerInfo = async () => {

        const customerInfo = {
            licenseKey:props.data.licenseKey,
            companyName: companyName,
            email: email,
            address: address,
            telephone: telephone,
            other: other
        }
        try {

            await addDoc(collection(db, "expiringkeys"), {licenseKey:props.data.licenseKey,customerInfo:customerInfo});

            toast.success('Güncelleme işlemi tamamlandı.', {
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
            console.error('Error updating customerInfo: ', error);
        }
        closeModal()
    }

    return (
        <Fragment>
            <Modal
                show={props.showModal}
                size="2xl"
                popup={true}
                onClose={() => props.closeModal()}>
                <Modal.Header/>
                <Modal.Body>
                    <div className="flex items-center w-full">
                        <div className="w-full bg-white rounded shadow-2xl p-8 m-4">
                            <h1 className="flex  items-center text-red-600 text-2xl font-ubuntu font-bold mb-6"><SlUser
                                className="m-2 w-5 h-5 text-red-500"/>Aranan Müşteri Bilgileri</h1>
                            <form>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-sky-900" htmlFor="company_name">Durum</label>
                                    <select
                                        id="select"
                                        className="form-select w-full py-2 px-3 py-0 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none focus:outline-none focus:shadow-outline"
                                        value={callStatus}
                                        onChange={(event) => {setCallStatus(event.target.value)}}
                                    >

                                        <option value="">Müşteriye telefon edildi mi?</option>
                                        <option value="Arandı">Arandı</option>
                                        <option value="Aranacak">Aranacak</option>
                                        <option value="Tekrar Aranacak">Tekrar Aranacak</option>
                                        <option value="Meşgul">Meşgul</option>
                                    </select>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-sky-900" htmlFor="company_name">Şirket
                                        Adı
                                    </label>
                                    <input className="border py-2 px-3 text-grey-800" type="text" name="company_name"

                                           id="company_name" value={companyName}
                                           onChange={(event) => setCompanyName(event.target.value)}/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-sky-900" htmlFor="address">Adres
                                    </label>
                                    <input className="border py-2 px-3 text-grey-800" type="text" name="address"

                                           id="address" value={address}
                                           onChange={(event) => setAddress(event.target.value)}/>
                                </div>

                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-sky-900"
                                           htmlFor="email">Email</label>
                                    <input className="border py-2 px-3 text-grey-800" type="email" name="email"

                                           id="email" value={email} onChange={(event) => setEmail(event.target.value)}/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-sky-900"
                                           htmlFor="other">Telefon</label>
                                    <input className="border py-2 px-3 text-grey-800" type="text" name="other"

                                           id="other" value={telephone}
                                           onChange={(event) => setTelephone(event.target.value)}/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-sky-900"
                                           htmlFor="other">Açıklama</label>
                                    <textarea className="border py-2 px-3 text-grey-800" name="other"

                                              id="other" value={other}
                                              onChange={(event) => setOther(event.target.value)}/>
                                </div>

                                        <button
                                            className="flex flex-row-reverse bg-gray-900 hover:bg-blue-500 ease-in duration-300 text-white text-lg mx-auto p-5 rounded-lg"
                                            type="button" onClick={addFirestoreCustomerInfo}>{props.data?.customerInfo === undefined ? 'Bilgileri Kaydet' : 'Bilgileri Güncelle'}
                                        </button>

                            </form>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Fragment>

    );
}

export default CustomerInfoModal;