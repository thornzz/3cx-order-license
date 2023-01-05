import React, {Fragment} from 'react';
import {Modal} from "flowbite-react";

function EndUserModal(props) {

    return (
        <Fragment>
            <Modal
                show={props.showModal}
                size="2xl"
                popup={true}
                onClose={() => props.closeModal()}>
                <Modal.Header/>
                <Modal.Body>
                    <div className="flex justify-center items-center h-screen w-full bg-blue-400">
                        <div className="w-1/2 bg-white rounded shadow-2xl p-8 m-4">
                            <h1 className="block w-full text-center text-gray-800 text-2xl font-bold mb-6">Register</h1>
                            <form action="/" method="post">
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-gray-900" htmlFor="first_name">First
                                        Name</label>
                                    <input className="border py-2 px-3 text-grey-800" type="text" name="first_name"
                                           id="first_name"/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-gray-900" htmlFor="last_name">Last
                                        Name</label>
                                    <input className="border py-2 px-3 text-grey-800" type="text" name="last_name"
                                           id="last_name"/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-gray-900"
                                           htmlFor="email">Email</label>
                                    <input className="border py-2 px-3 text-grey-800" type="email" name="email"
                                           id="email"/>
                                </div>
                                <div className="flex flex-col mb-4">
                                    <label className="mb-2 font-bold text-lg text-gray-900"
                                           htmlFor="password">Password</label>
                                    <input className="border py-2 px-3 text-grey-800" type="password" name="password"
                                           id="password"/>
                                </div>
                                <button
                                    className="block bg-teal-400 hover:bg-teal-600 text-white uppercase text-lg mx-auto p-4 rounded"
                                    type="submit">Create Account
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