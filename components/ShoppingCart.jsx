import React, {Fragment, useState,useEffect} from 'react'
import {FaShoppingCart} from 'react-icons/fa'
import {useRecoilValue} from "recoil";
import {cartLength} from "../atoms/shoppingCartAtom";
import Link from "next/link";
const ShoppingCart = () => {
    const [showModal, setShowModal] = useState(false)
    const cartLengthState = useRecoilValue(cartLength);
    const [getCartLengthState,setCartLengthState] = useState(null)

    useEffect(()=>{
        setCartLengthState(cartLengthState)
    },[cartLengthState])

    const toggleModalShow = () => {
        setShowModal(!showModal)
    }

    return (
        <Fragment>
            <div className="relative inline-block text-left">
                <div
                    className="bg-red-600 rounded-full w-[25px] px-2 mx-2 text-sm  text-white"
                >
                    {getCartLengthState}
                </div>
                <button>
                         <FaShoppingCart className="text-red  w-[15px]"/>
                </button>
            </div>
        </Fragment>
    )
}

export default ShoppingCart