import React from 'react';
import Image from "next/image";

function Footer(props) {
    return (
        <footer aria-label="Site Footer" className="bg-gray-900">
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="sm:flex sm:items-center sm:justify-between">
                    <div className="flex justify-center text-teal-600 sm:justify-start">
                    </div>

                    <p className="mt-4 text-center text-sm text-white lg:mt-0 lg:text-right">
                        K2M Bilisim Copyright &copy; 2023. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>

    );
}

export default Footer;