import React, {Fragment, useState} from 'react'
import {FaShoppingCart} from 'react-icons/fa'
import OrderDetailsModal from "./OrderDetailsModal";
import {useRecoilValue} from "recoil";
import {cartLength} from "../atoms/shoppingCartAtom";
const ShoppingCart = () => {
    const [showModal, setShowModal] = useState(false)
    const cartLengthState = useRecoilValue(cartLength);
    const toggleModalShow = () => {
       setShowModal(!showModal)
    }

    return (
        <Fragment>

            <OrderDetailsModal showModal={showModal} closeModal={toggleModalShow} />
        <div className="relative inline-block text-left">
            <div
                className="bg-red-600 rounded-full w-[25px] px-2 mx-2 text-sm  text-white"
            >
                {cartLengthState}
            </div>
            <button onClick={()=> cartLengthState > 0 && toggleModalShow()}>
                <FaShoppingCart className="text-white hover:text-gray-200 w-[20px]"/>
            </button>
        </div>
        </Fragment>
    )
}

export default ShoppingCart