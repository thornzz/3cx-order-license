import React from 'react';

function DataTable() {
    return (
        <div className="container mx-auto mt-10">
            <table className="w-full text-center">
                <thead>
                <tr className="bg-gray-800 text-white">
                    <th className="p-4">Lisans Key</th>
                    <th className="p-4">Bayi</th>
                    <th className="p-4">Satış Tarihi</th>
                </tr>
                </thead>
                <tbody>
                <tr className="bg-gray-100">
                    <td className="p-4">CXS2-ASD2-GGG4-2212</td>
                    <td className="p-4">AVENCOM</td>
                    <td className="p-4">26.12.2022</td>
                </tr>
                <tr className="bg-gray-200">
                    <td className="p-4">DXS2-ASD2-2DG4-2112</td>
                    <td className="p-4">COMNET</td>
                    <td className="p-4">25.12.2022</td>
                </tr>
                </tbody>
            </table>
        </div>
    );
}

export default DataTable;