import React, {Fragment, useState} from 'react';
import {Modal} from "flowbite-react";
import Select from 'react-select'
const BuyLicenseModal = (props) => {

    const [toggleValue, setToggleValue] = useState(false)
    const [selectValue, setSelectValue] = useState('')
    const [numberValue1, setNumberValue1] = useState(0)
    const [numberValue2, setNumberValue2] = useState(0)
    const [selectValue1, setSelectValue1] = useState('')
    const [selectValue2, setSelectValue2] = useState('')
    const [selectValue3, setSelectValue3] = useState('')

    const options = [
        { value: 'avencom', label: 'AVENCOM' },
        { value: 'comnet', label: 'COMNET' },
        { value: 'arena', label: 'ARENA' }
    ]
    console.log(toggleValue)
    const closeModal = () => {

        props.closeModal()
    }

    return (
        <Fragment>
            <Modal
                show={props.showModal}
                size="md"
                popup={true}
                onClose={() => closeModal()}>
                <Modal.Header/>
                <Modal.Body>
                    <h1>YENİ LİSANS</h1>
                    <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="select1">
                               Lisans Tipi
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <select
                                    id="select1"
                                    className="form-select w-full py-2 px-3 py-0 leading-tight text-gray-700 bg-white border border-gray-400 rounded appearance-none focus:outline-none focus:shadow-outline"
                                    value={selectValue1}
                                    onChange={(event) => setSelectValue1(event.target.value)}
                                >
                                    <option value="">Lisans Tipini Seçiniz</option>
                                    <option value="Standard">Standard</option>
                                    <option value="Professional">Professional</option>
                                    <option value="Enterprise">Enterprise</option>
                                    <option value="Free">Free</option>
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
                                    value={selectValue2}
                                    onChange={(event) => setSelectValue2(event.target.value)}
                                >
                                    <option value="">Kanal sayısını seçiniz </option>
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

                            <label className="block text-gray-700 text-sm font-bold mb-2 mt-2" htmlFor="select3">
                                Bayi Seçimi
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <Select options={options}
                                        isLoading={false}
                                        isClearable={true}
                                        noOptionsMessage={()=> "Uygun kayıt bulunamadı!"}
                                        placeholder="Bayi seçimi yapınız">

                                </Select>

                            </div>
                    <div className="mb-4 mt-2">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="number1">
                           Adet
                        </label>
                        <input
                            id="number1"
                            type="number"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            value={numberValue1}
                            onChange={(event) => setNumberValue1(event.target.value)}
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
                            value={numberValue2}
                            onChange={(event) => setNumberValue2(event.target.value)}
                        />
                    </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="toggle">
                                Perpetual Lisans mı?
                            </label>
                            <div className="relative rounded-md shadow-sm">
                                <input
                                    id="toggle"
                                    type="checkbox"
                                    className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                    checked={toggleValue}
                                    onChange={(event) => setToggleValue(event.target.checked)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">

                        <button
                            className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            type="button"
                        >
                            SATIN AL
                        </button>
                    </div>
                    </form>

                </Modal.Body>
            </Modal>
        </Fragment>

    );
};

export default BuyLicenseModal;