import React, {Fragment, useEffect, useState} from 'react';
import {Modal} from "flowbite-react";
import {useRecoilState} from "recoil";
import {cartDetail} from "../atoms/shoppingCartAtom";
import {SlUser} from "react-icons/sl";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "../firebase";
import {toast} from "react-toastify";

function EndUserModal(props) {
    const [cartDetailState, setDetailCartState] = useRecoilState(cartDetail);

    const [companyName, setCompanyName] = useState('')
    const [email, setEmail] = useState('')
    const [address, setAddress] = useState('')
    const [telephone, setTelephone] = useState('')
    const [other, setOther] = useState('')
    const [defaultSelectedIndex, setDefaultSelectedIndex] = useState(0);

    useEffect(() => {
        if (defaultSelectedIndex !== undefined && defaultSelectedIndex !== null) {
            if (cartDetailState[defaultSelectedIndex]?.Items !== undefined) {

                const {endUser} = cartDetailState[defaultSelectedIndex].Items[0];

                if (Object.keys(endUser).length === 0) {
                    setCompanyName('')
                    setAddress('')
                    setEmail('')
                    setTelephone('')
                    setOther('')
                } else {
                    setCompanyName(endUser.companyName)
                    setAddress(endUser.address)
                    setTelephone(endUser.telephone)
                    setOther(endUser.other)
                    setEmail(endUser.email)
                }
            }
        }
    }, [defaultSelectedIndex])

    useEffect(() => {

        if (props.selectedIndex !== undefined)
            setDefaultSelectedIndex(props.selectedIndex)
        else
            setDefaultSelectedIndex(0)
    })

    useEffect(() => {

        if (props.expiringKeysData === undefined || props.expiringKeysData === null) {
            setCompanyName('')
            setAddress('')
            setEmail('')
            setTelephone('')
            setOther('')
        } else {

            if (Object.keys(props.expiringKeysData.endUser).length !== 0) {
                setCompanyName(props?.expiringKeysData?.endUser?.companyName)
                setAddress(props.expiringKeysData?.endUser?.address)
                setEmail(props.expiringKeysData?.endUser?.email)
                setTelephone(props.expiringKeysData?.endUser?.telephone)
                setOther(props.expiringKeysData?.endUser?.other)
            }
        }

    }, [props.expiringKeysData])

    useEffect(() => {

        if (props.tableData !== undefined && props.tableData !== null) {

            if (Object.keys(props.tableData.endUser).length === 0) {
                setCompanyName('')
                setAddress('')
                setEmail('')
                setTelephone('')
                setOther('')
            } else {
                setCompanyName(props?.tableData?.endUser?.companyName)
                setAddress(props.tableData?.endUser?.address)
                setEmail(props.tableData?.endUser?.email)
                setTelephone(props.tableData?.endUser?.telephone)
                setOther(props.tableData?.endUser?.other)
            }


        }
    }, [props.tableData])
    const closeModal = () => {
        props.closeModal()
    }

    const setCartDetail = () => {

        const enduserObject = {
            companyName: companyName,
            email: email,
            address: address,
            telephone: telephone,
            other: other
        }

        setDetailCartState((prevCartDetail) => {
            const newCartDetail = [...prevCartDetail];
            newCartDetail[props.selectedIndex] = {
                ...newCartDetail[props.selectedIndex],
                Items: [
                    {
                        ...newCartDetail[props.selectedIndex].Items[0],
                        endUser: enduserObject
                    },
                ],
            };
            return newCartDetail;
        });
        closeModal()
    }
    const updateFirestoreEndUser = async () => {

        const enduserObject = {
            companyName: companyName,
            email: email,
            address: address,
            telephone: telephone,
            other: other
        }
        try {
            const licensesDocRef = doc(db, "licenses", props.tableData.objectId);
            const docSnap = await getDoc(licensesDocRef);
            const data = docSnap.data()

            const updatedItems = data.tcxResponses.Items.map((item) => {
                if (item.Line === props.tableData.Line) {
                    return {...item, endUser: enduserObject};
                }
                return item;
            });
            await updateDoc(licensesDocRef, {tcxResponses: {Items: updatedItems}})
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
            console.error('Error updating endUser in Item object: ', error);
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
                                className="m-2 w-5 h-5 text-red-500"/>End User Bilgileri</h1>
                            <form>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-sky-900" htmlFor="company_name">Şirket
                                        Adı
                                    </label>
                                    <input className="border py-2 px-3 text-grey-800" type="text" name="company_name"
                                           disabled={props.expiringKeysData}
                                           id="company_name" value={companyName}
                                           onChange={(event) => setCompanyName(event.target.value)}/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-sky-900" htmlFor="address">Adres
                                    </label>
                                    <input className="border py-2 px-3 text-grey-800" type="text" name="address"
                                           disabled={props.expiringKeysData}
                                           id="address" value={address}
                                           onChange={(event) => setAddress(event.target.value)}/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-sky-900"
                                           htmlFor="email">Email</label>
                                    <input className="border py-2 px-3 text-grey-800" type="email" name="email"
                                           disabled={props.expiringKeysData}
                                           id="email" value={email} onChange={(event) => setEmail(event.target.value)}/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-sky-900"
                                           htmlFor="other">Telefon</label>
                                    <input className="border py-2 px-3 text-grey-800" type="text" name="other"
                                           disabled={props.expiringKeysData}
                                           id="other" value={telephone}
                                           onChange={(event) => setTelephone(event.target.value)}/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-sky-900"
                                           htmlFor="other">Açıklama</label>
                                    <textarea className="border py-2 px-3 text-grey-800" name="other"
                                              disabled={props.expiringKeysData}
                                              id="other" value={other}
                                              onChange={(event) => setOther(event.target.value)}/>
                                </div>

                                {props.expiringKeysData !== null && props.expiringKeysData !== undefined ? null :
                                    props.tableData ? (
                                        <button
                                            className="flex flex-row-reverse bg-gray-900 hover:bg-blue-500 ease-in duration-300 text-white text-lg mx-auto p-5 rounded-lg"
                                            type="button" onClick={setCartDetail}>Bilgileri Kaydet
                                        </button>
                                    ) : (
                                        <button
                                            className="flex flex-row-reverse bg-gray-900 hover:bg-blue-500 ease-in duration-300 text-white text-lg mx-auto p-5 rounded-lg"
                                            type="button" onClick={updateFirestoreEndUser}>Bilgileri Güncelle
                                        </button>
                                    )
                                }

                            </form>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Fragment>

    );
}

export default EndUserModal;