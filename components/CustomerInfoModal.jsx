import React, {Fragment, useEffect, useState} from 'react';
import {Modal} from "flowbite-react";
import {SlUser} from "react-icons/sl";
import {addDoc, collection, doc, getDocs, query, updateDoc, where} from "firebase/firestore";
import {db} from "../firebase";
import {toast} from "react-toastify";
import {useSession} from "next-auth/react";

function CustomerInfoModal(props) {

    const [resellerEmail, setResellerEmail] = useState(null)
    const [resellerCall, setResellerCall] = useState(null)
    const [endUserEmail, setEndUserEmail] = useState(null)
    const [endUserCall, setEndUserCall] = useState(null)
    const [other, setOther] = useState('')
    const [newRecord, setNewRecord] = useState(true)
    const {data: session} = useSession()

    useEffect(() => {

        if (props.data !== undefined && props.data !== null) {

            if (props.data.customerInfo === undefined) {
                setResellerEmail(false)
                setResellerCall(false)
                setEndUserEmail(false)
                setEndUserCall(false)
                setOther('')
                setNewRecord(true)
            } else {
                setNewRecord(false)
                setResellerEmail(props.data.customerInfo.resellerEmail.checked)
                setResellerCall(props.data.customerInfo.resellerCall.checked)
                setEndUserEmail(props.data.customerInfo.endUserEmail.checked)
                setEndUserCall(props.data.customerInfo.endUserCall.checked)
                setOther(props.data.customerInfo.other)
            }

        }
    }, [props.data, newRecord])

    const getCurrentDateTime = () => {
        const date = new Date();
        // Use the toLocaleDateString() method to format the date
        const formattedDate = date.toLocaleDateString('tr-TR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        // Use the toLocaleTimeString() method to format the time
        const formattedTime = date.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return `${formattedDate} ${formattedTime}`
    }
    const closeModal = () => {
        props.closeModal()
    }

    const addFirestoreCustomerInfo = async () => {
        console.log(props.data.customerInfo)

        //
        // console.log(`New Record : ${newRecord}, End User Email : ${endUserCall} End User call User : ${props.data?.customerInfo?.endUserCall.user}`)

        const customerInfo = {}

        // EndUserEmail kontrolü

        if (newRecord && endUserEmail) {
            console.log('70')
            customerInfo.endUserEmail = {
                user: session.user.email.split('@')[0],
                checked: endUserEmail,
                datetime: getCurrentDateTime()
            }
        } else if (newRecord && !endUserEmail) {
            console.log('77')
            customerInfo.endUserEmail = {
                user: null,
                checked: endUserEmail,
                datetime: null
            }
        } else if (!newRecord && endUserEmail && props.data.customerInfo.endUserEmail.user !== null) {
            console.log('84')
            customerInfo.endUserEmail = {
                user: props.data.customerInfo.endUserEmail.user,
                checked: endUserEmail,
                datetime: props.data.customerInfo.endUserEmail.datetime
            }
        } else if (!newRecord && endUserEmail && props.data.customerInfo.endUserEmail.user === null) {
            console.log('91')
            customerInfo.endUserEmail = {
                user: session.user.email.split('@')[0],
                checked: endUserEmail,
                datetime: getCurrentDateTime()
            }
        } else {
            console.log('else girdi')
            customerInfo.endUserEmail = {
                user: null,
                checked: false,
                datetime: null
            }
        }

        // EndUserCall kontrolü

        if (newRecord && endUserCall) {
            console.log('70')
            customerInfo.endUserCall = {
                user: session.user.email.split('@')[0],
                checked: endUserCall,
                datetime: getCurrentDateTime()
            }
        } else if (newRecord && !endUserCall) {
            console.log('77')
            customerInfo.endUserCall = {
                user: null,
                checked: endUserCall,
                datetime: null
            }
        } else if (!newRecord && endUserCall && props.data.customerInfo.endUserCall.user !== null) {
            console.log('84')
            customerInfo.endUserCall = {
                user: props.data.customerInfo.endUserCall.user,
                checked: endUserEmail,
                datetime: props.data.customerInfo.endUserCall.datetime
            }
        } else if (!newRecord && endUserCall && props.data.customerInfo.endUserCall.user === null) {
            console.log('91')
            customerInfo.endUserCall = {
                user: session.user.email.split('@')[0],
                checked: endUserCall,
                datetime: getCurrentDateTime()
            }
        } else {
            console.log('else girdi')
            customerInfo.endUserCall = {
                user: null,
                checked: false,
                datetime: null
            }
        }

        // resellerEmail kontrolü

        if (newRecord && resellerEmail) {
            console.log('70')
            customerInfo.resellerEmail = {
                user: session.user.email.split('@')[0],
                checked: resellerEmail,
                datetime: getCurrentDateTime()
            }
        } else if (newRecord && !resellerEmail) {
            console.log('77')
            customerInfo.resellerEmail = {
                user: null,
                checked: resellerEmail,
                datetime: null
            }
        } else if (!newRecord && resellerEmail && props.data.customerInfo.resellerEmail.user !== null) {
            console.log('84')
            customerInfo.resellerEmail = {
                user: props.data.customerInfo.resellerEmail.user,
                checked: resellerEmail,
                datetime: props.data.customerInfo.resellerEmail.datetime
            }
        } else if (!newRecord && resellerEmail && props.data.customerInfo.resellerEmail.user === null) {
            console.log('91')
            customerInfo.resellerEmail = {
                user: session.user.email.split('@')[0],
                checked: resellerEmail,
                datetime: getCurrentDateTime()
            }
        } else {
            console.log('else girdi')
            customerInfo.resellerEmail = {
                user: null,
                checked: false,
                datetime: null
            }
        }

        // resellerCall kontrolü

        if (newRecord && resellerCall) {
            console.log('70')
            customerInfo.resellerCall = {
                user: session.user.email.split('@')[0],
                checked: resellerCall,
                datetime: getCurrentDateTime()
            }
        } else if (newRecord && !resellerCall) {
            console.log('77')
            customerInfo.resellerCall = {
                user: null,
                checked: resellerCall,
                datetime: null
            }
        } else if (!newRecord && resellerCall && props.data.customerInfo.resellerCall.user !== null) {
            console.log('84')
            customerInfo.resellerCall = {
                user: props.data.customerInfo.resellerCall.user,
                checked: resellerEmail,
                datetime: props.data.customerInfo.resellerCall.datetime
            }
        } else if (!newRecord && resellerCall && props.data.customerInfo.resellerCall.user === null) {
            console.log('91')
            customerInfo.resellerCall = {
                user: session.user.email.split('@')[0],
                checked: resellerCall,
                datetime: getCurrentDateTime()
            }
        } else {
            console.log('else girdi')
            customerInfo.resellerCall = {
                user: null,
                checked: false,
                datetime: null
            }
        }
        customerInfo.other = other



        // const customerInfo = {
        //
        //     endUserEmail: {
        //         user: newRecord && endUserEmail ? session.user.email.split('@')[0] : !newRecord && endUserEmail && props.data?.customerInfo.endUserEmail!==null ? props.data?.customerInfo.endUserEmail.user  : !newRecord && !endUserEmail   ? null: !newRecord && endUserEmail && props.data?.customerInfo.endUserEmail===null ? session.user.name : null,
        //         checked: endUserEmail,
        //         datetime: endUserEmail ? (newRecord ? getCurrentDateTime(): props.data.customerInfo.endUserEmail.datetime):'',
        //     },
        //     endUserCall: {
        //         user: newRecord && endUserCall ? session.user.email.split('@')[0] : !newRecord && endUserCall && props.data?.customerInfo.endUserCall!==null ? props.data?.customerInfo.endUserCall.user  : !newRecord && !endUserCall   ? null: !newRecord && endUserCall && props.data?.customerInfo.endUserCall===null ? session.user.name : null,
        //         checked: endUserCall,
        //         datetime: endUserCall ? (newRecord ? getCurrentDateTime(): props.data.customerInfo.endUserCall.datetime):'',
        //     },
        //     resellerEmail: {
        //         user: newRecord && resellerEmail ? session.user.email.split('@')[0] : !newRecord && resellerEmail && props.data?.customerInfo.resellerEmail!==null ? props.data?.customerInfo.resellerEmail.user  : !newRecord && !resellerEmail   ? null: !newRecord && resellerEmail && props.data?.customerInfo.resellerEmail===null ? session.user.name : null,
        //         checked: resellerEmail,
        //         datetime: resellerEmail ? (newRecord ? getCurrentDateTime(): props.data.customerInfo.resellerEmail.datetime):'',
        //     },
        //     resellerCall: {
        //
        //         user: newRecord && resellerCall ? session.user.email.split('@')[0] : !newRecord && resellerCall && props.data?.customerInfo.resellerCall!==null ? props.data?.customerInfo.resellerCall.user  : !newRecord && !resellerCall   ? null: !newRecord && resellerCall && props.data?.customerInfo.resellerCall===null ? session.user.name : null,
        //         checked: resellerCall,
        //         datetime: resellerCall ? (newRecord ? getCurrentDateTime(): props.data.customerInfo.resellerCall.datetime):'',
        //     },
        //     other: other
        // }
        try {
            if (newRecord) {
                await addDoc(collection(db, "expiringkeys"), {
                    licenseKey: props.data.licenseKey,
                    customerInfo: customerInfo
                });
            } else {
                const collectionRef = collection(db, 'expiringkeys');
                const q = query(collectionRef, where("licenseKey", "==", props.data.licenseKey));
                const querySnapshot = await getDocs(q);
                const [customerInfoData] = querySnapshot.docs.map((d) => ({objectId: d.id, ...d.data()}))

                const expiryDoc = doc(db, "expiringkeys", customerInfoData.objectId);
                await updateDoc(expiryDoc, {customerInfo: customerInfo})
            }

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
                            <h1 className="flex  items-center text-blue-900 text-2xl font-ubuntu font-bold mb-6"><SlUser
                                className="m-2 w-5 h-5 text-blue-900"/>Aranan Müşteri Kaydı</h1>
                            <form>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input id="comments" name="comments" type="checkbox"
                                                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                   checked={Boolean(resellerEmail)}
                                                   onChange={(event) => {
                                                       setResellerEmail(event.currentTarget.checked)
                                                   }}/>
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="comments"
                                                   className="font-medium text-gray-700">Reseller Email
                                                Gönderimi</label>
                                            <p className="text-gray-500">{props?.data?.customerInfo?.resellerEmail?.user} - {props.data?.customerInfo?.resellerEmail?.datetime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input id="comments" name="comments" type="checkbox"
                                                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                   checked={Boolean(resellerCall)}
                                                   onChange={(event) => {
                                                       setResellerCall(event.currentTarget.checked)
                                                   }}/>
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="comments"
                                                   className="font-medium text-gray-700">Reseller Aranması</label>
                                            <p className="text-gray-500">{props?.data?.customerInfo?.resellerCall?.user} - {props.data?.customerInfo?.resellerCall?.datetime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input id="comments" name="comments" type="checkbox"
                                                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                   checked={Boolean(endUserEmail)}
                                                   onChange={(event) => {
                                                       setEndUserEmail(event.currentTarget.checked)
                                                   }}/>
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="comments"
                                                   className="font-medium text-gray-700">Son Kullanıcı Email
                                                Gönderimi</label>
                                            <p className="text-gray-500">{props?.data?.customerInfo?.endUserEmail?.user} - {props.data?.customerInfo?.endUserEmail?.datetime}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex h-5 items-center">
                                            <input id="comments" name="comments" type="checkbox"
                                                   checked={Boolean(endUserCall)}
                                                   onChange={(event) => {
                                                       setEndUserCall(event.currentTarget.checked)
                                                   }}
                                                   className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="comments"
                                                   className="font-medium text-gray-700">Son Kullanıcı Aranması</label>
                                            <p className="text-gray-500">{props?.data?.customerInfo?.endUserCall?.user} - {props.data?.customerInfo?.endUserCall?.datetime}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col mb-4 mt-2">
                                    <label className="mb-2 font-bold text-lg text-blue-900"
                                           htmlFor="other">Diğer</label>
                                    <textarea className="border py-2 px-3 text-grey-800" name="other"

                                              id="other" value={other}
                                              onChange={(event) => setOther(event.target.value)}/>
                                </div>

                                <button
                                    className="flex flex-row-reverse bg-blue-900 hover:bg-blue-600 ease-in duration-300 text-white text-lg mx-auto p-5 rounded-lg"
                                    type="button"
                                    onClick={addFirestoreCustomerInfo}>{props.data?.customerInfo === undefined ? 'Bilgileri Kaydet' : 'Bilgileri Güncelle'}
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