import React from 'react';

const Footer = ()=> {
    return (
        <footer className="bg-gray-900 py-4 text-white">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between flex-wrap">
                    <div className="w-full md:w-1/3 text-center md:text-left">
                        <p className="text-sm">
                            &copy; {new Date().getFullYear()} K2M Bilisim. All rights reserved.
                        </p>
                    </div>
                    <div className="w-full md:w-1/3 text-center md:text-right">
                        <p className="text-sm">
                            Built with ❤️ using Tailwind CSS.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;