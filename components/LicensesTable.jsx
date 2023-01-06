import DataTable from 'react-data-table-component';
import React, {useEffect, useState} from "react";
import {tableStyle} from "./styles/tableStyle";
import {useRecoilState} from "recoil";
import {licenses} from "../atoms/fireStoreDataAtom";
import {RotatingSquare} from "react-loader-spinner";

const LicensesTable = () => {
    //const [myData, setData] = useState([])
    const [searchText, setSearchText] = useState("");
    const [licenseState, setLicenseState] = useRecoilState(licenses);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const columns = [
        {
            name: 'Fatura ID',
            selector: row => row.InvoiceId,
        },
        {
            name: 'Bayi',
            selector: row => row.ResellerName,
            sortable: true,
            grow: 2,
            filter: true
        },

        {
            name: 'End user',
            selector: row => row.endUser,
            sortable: true
        },
        {
            name: 'İşlem Türü',
            selector: row => row.Type === 'NewLicense' ? 'Yeni Lisans' : row.Type === 'RenewAnnual' ? 'Lisans Yenileme' : 'Lisans Yükseltme',
            sortable: true
        },
        {
            name: 'Lisans Anahtarı',
            selector: row => row.LicenseKey,
            grow: 2,
        },
        {
            name: 'Lisans Tipi',
            selector: row => row.Edition,
            sortable: true
        },
        {
            name: 'Kanal',
            selector: row => row.SimultaneousCalls,
            sortable: true
        },
        {
            name: 'Tarih',
            selector: row => row.DateTime,
        },
        {
            name: 'Düzenle',
            selector: null,
        }

    ];
    const handleSearch = event => {
        setSearchText(event.target.value);
    };

    const filteredData = licenseState.filter(item =>
        [item.ResellerName, item.LicenseKey, item.DateTime]
            .map(val => val.toLowerCase())
            .some(val => val.includes(searchText.toLowerCase()))
    );
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );
    useEffect(() => {
        (async () => {
            try {
                const firestoreData = await fetch('/api/getfirestoredata');
                const data = await firestoreData.json();
                setLicenseState(data)
                const timer = setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
                return () => clearTimeout(timer);
            } catch (e) {
                console.log(e)
            }

        })();

    }, [])


    return (
        <div>
            {isLoading ? (
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <RotatingSquare
                        height="100"
                        width="100"
                        color="white"
                        ariaLabel="rotating-square-loading"
                        strokeWidth="4"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                    />
                </div>
            ) : (
                <DataTable
                    columns={columns}
                    data={paginatedData}
                    customStyles={tableStyle}
                    highlightOnHover={true}
                    noDataComponent={'Herhangi bir kayıt bulunamadı'}
                    subHeader
                    subHeaderComponent={
                        <div style={{display: "flex", alignItems: "center"}}>
                            <h3 style={{margin: "0 10px"}}>Ara :</h3>
                            <input
                                type="text"
                                value={searchText}
                                onChange={handleSearch}
                                style={{border: "none", borderBottom: "1px solid black"}}
                            />
                        </div>
                    }
                    pagination
                    paginationComponentOptions={{
                        rowsPerPageText: "Kayıt sayısı :",
                        rangeSeparatorText: "/",
                        noRowsPerPage: false,
                        selectAllRowsItem: false,
                        selectAllRowsItemText: "All"
                    }}
                    onChangeRowsPerPage={setRowsPerPage}
                    onChangePage={setCurrentPage}
                    paginationServer
                    paginationTotalRows={filteredData.length}
                    paginationRowsPerPageOptions={[10, 25, 50]}
                />
            )}
        </div>
    )
}

export default LicensesTable