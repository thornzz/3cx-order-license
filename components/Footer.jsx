import React from 'react';
import Image from "next/image";

function Footer(props) {
    return (
        <footer aria-label="Site Footer" class="bg-gray-900">
        <div class="max-w-full px-4 py-8 sm:px-6 lg:px-8">
            <div class="flex flex-col items-center justify-center sm:flex-row">
                <div class="text-center sm:text-left text-teal-600">
                   
                </div>
                <p class="mt-4 text-sm text-white lg:mt-0 lg:text-right">
                    K2M Bilisim Copyright &copy; 2023. All rights reserved.
                </p>
            </div>
        </div>
    </footer>
    

    );
}

export default Footer;