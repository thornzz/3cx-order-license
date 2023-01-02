import React from 'react';
import {auth} from "../firebase";
import Image from 'next/image'
import ShoppingCart from "./ShoppingCart";
import {cart} from "../atoms/shoppingCartAtom";
import {useRecoilState} from "recoil";

function Navbar() {
    const [resetCart,setResetCart] = useRecoilState(cart);

    const Logout = async () => {
        setResetCart([]);
        await auth.signOut();
    }
    return (
        <nav className="flex items-center justify-between bg-gray-900 shadow shadow-xl">
            <div className="flex items-center flex-shrink-0 text-white mr-6 mt-2">

                <Image
                    src="/logo.png"
                    alt="K2M Bilişim Logo"
                    width={140}
                    height={90}
                />
                <span className="font-semibold text-xl tracking-tight">Lisans Portal</span>
            </div>

            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto mt-2">
                <div className="text-md lg:flex-grow">
                    <a href="#responsive-header"
                       className="block mt-4 lg:inline-block lg:mt-0 text-gray-400 hover:text-white mr-4">

                    </a>

                </div>


                <div className="flex items-center w-[170px] justify-between ">
                    <ShoppingCart/>
                    <a href="#"
                       onClick={Logout}
                       className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 mr-4 lg:mt-0">Çıkış Yap</a>
                </div>
            </div>
        </nav>


    );
}

export default Navbar;