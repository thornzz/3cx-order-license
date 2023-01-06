import React, {Fragment} from 'react';
import {Modal} from "flowbite-react";

function EndUserModal(props) {
    const closeModal = () => {
        props.closeModal()
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
                    <div className="flex justify-center items-center w-full">
                        <div className="w-full bg-white rounded shadow-2xl p-8 m-4">
                            <h1 className="block w-full text-center text-gray-800 text-2xl font-ubuntu font-bold mb-6">End User Bilgileri</h1>
                            <form action="/" method="post">
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-gray-900" htmlFor="company_name">Şirket Adı
                                    </label>
                                    <input className="border py-2 px-3 text-grey-800" type="text" name="company_name"
                                           id="company_name"/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-gray-900" htmlFor="address">Adres
                                        </label>
                                    <input className="border py-2 px-3 text-grey-800" type="text" name="address"
                                           id="address"/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-gray-900"
                                           htmlFor="email">Email</label>
                                    <input className="border py-2 px-3 text-grey-800" type="email" name="email"
                                           id="email"/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-gray-900"
                                           htmlFor="other">Diğer</label>
                                    <input className="border py-2 px-3 text-grey-800" type="text" name="other"
                                           id="other"/>
                                </div>
                                <button
                                    className="block bg-gray-900 hover:bg-blue-500 ease-in duration-300 text-white uppercase text-lg mx-auto p-4 rounded"
                                    type="submit">Bilgileri kaydet
                                </button>
                            </form>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </Fragment>

    );
}

export default EndUserModal;