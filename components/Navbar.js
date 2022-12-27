import React from 'react';
import Link from "next/link";
import {auth} from "../firebase";
import {
    faDriversLicense,
    faSignOut,
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

function Navbar() {
    const Logout = async () => {
        await auth.signOut();
    }
    return (
        <nav className="bg-gray-800 p-5 mb-4 flex justify-between items-center shadow-md shadow-blue-400">
            <Link href="/" className="text-white font-bold">
                <FontAwesomeIcon icon={faDriversLicense} color={"white"} fontSize={"20"}/>  3CX Lisans Portal
            </Link>
            <div>

                <button onClick={Logout} className="text-white px-4 hover:bg-gray-700 rounded-lg">
                    <FontAwesomeIcon icon={faSignOut} color={"white"} fontSize={"20"}/> Çıkış Yap
                </button>
            </div>
        </nav>
    );
}

export default Navbar;