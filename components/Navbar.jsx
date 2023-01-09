import React from 'react';
import Image from 'next/image'
import ShoppingCart from "./ShoppingCart";
import {cart} from "../atoms/shoppingCartAtom";
import {useRecoilState} from "recoil";
import Link from "next/link";
import {useRouter} from "next/router";
import {signOut, useSession} from "next-auth/react";
import {Dropdown} from "flowbite-react";
import {HiLogout, HiOutlineDocumentReport, HiViewGrid} from "react-icons/hi";

function Navbar() {

    const [resetCartState, setResetCartState] = useRecoilState(cart)
    const router = useRouter()
    const {data: session} = useSession()
    const Logout = async () => {
        await router.push('/login')
        await signOut()
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
                <span className="font-semibold text-xl tracking-tight"><Link
                    href='/dashboard'>Lisans Portal </Link></span>
            </div>

            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto mt-2">
                <div className="text-md lg:flex-grow">
                    <a href="#responsive-header"
                       className="block mt-4 lg:inline-block lg:mt-0 text-gray-400 hover:text-white mr-4">
                    </a>

                </div>


                <div className="flex items-center w-[110px]">
                    <Dropdown label="Menü" className="text-red-500 w-[250px]">
                        <Dropdown.Header>
                            <span className="block text-sm font-medium truncate">{session?.user?.email}</span>
                        </Dropdown.Header>
                        <Dropdown.Item icon={HiViewGrid}>
                            <Link href={'/dashboard'}>Dashboard</Link>
                        </Dropdown.Item>
                        <Dropdown.Item>
                            <Link className="flex items-center" href={'/cart'}> <ShoppingCart/> Sepet </Link>
                        </Dropdown.Item>
                        <Dropdown.Item icon={HiOutlineDocumentReport}>
                            <Link href={'/expiringkeys'}>Expiring Keys</Link>
                        </Dropdown.Item>
                        <Dropdown.Divider/>
                        <Dropdown.Item icon={HiLogout} onClick={Logout}>
                            Çıkış Yap
                        </Dropdown.Item>
                    </Dropdown>

                </div>
            </div>
        </nav>


    );
}

export default Navbar;