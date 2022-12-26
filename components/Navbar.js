import React from 'react';
import Link from "next/link";
import {auth} from "../firebase";

function Navbar() {
    const Logout = async () => {
        await auth.signOut();
    }
    return (
        <nav className="bg-gray-800 p-4 flex justify-between items-center shadow-2xl">
            <Link href="/" className="text-white font-bold">
                3CX Lisans Portal
            </Link>
            <div>
                <button onClick={Logout} className="text-white px-4 hover:bg-gray-700 rounded-lg">
                    Çıkış Yap
                </button>
            </div>
        </nav>
    );
}

export default Navbar;