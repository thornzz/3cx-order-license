import DataTable from 'react-data-table-component';
import React, {useEffect, useState} from "react";
import {tableStyle} from "./styles/tableStyle";
import {useRecoilState} from "recoil";
import {licenses} from "../atoms/fireStoreDataAtom";
import {RotatingSquare} from "react-loader-spinner";
import {AiOutlineEye} from "react-icons/ai";
import EndUserModal from "./EndUserModal";
import {TbLicense} from "react-icons/tb";
import {FaEdit} from "react-icons/fa";
import {HiOutlineKey} from "react-icons/hi";
import LicenseRenewModal from "./LicenseRenewModal";
import UpgradeLicenseModal from "./UpgradeLicenseModal";
import {db} from "../firebase";
import {collection, doc, getDoc, getDocs, updateDoc, onSnapshot, query} from "firebase/firestore";
import extractData from "../utility/extractFirestoreData";
import {Tooltip} from "flowbite-react";

const LicensesTable = () => {
    //const [myData, setData] = useState([])
    const [searchText, setSearchText] = useState("");
    const [licenseState, setLicenseState] = useRecoilState(licenses);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [openEndUserModal, setOpenEndUserModal] = useState(false);
    const [enduserData, setendUserData] = useState(null);
    const [licenseKey, setLicenseKey] = useState(null);
    const [openLicenseRenewModal, setlicenseRenewModal] = useState(null);
    const [openLicenseUpgradeModal, setlicenseUpgradeModal] = useState(null);
    const [invoiceId, setInvoiceId] = useState('');
    const [selectedRow, setSelectedRow] = useState('');

    const updateInvoiceIdInItemObject = async (invoiceId, documentId, itemLine) => {
        try {
            const licensesDocRef = doc(db, "licenses", documentId);
            const docSnap = await getDoc(licensesDocRef);
            const data = docSnap.data()

            const updatedItems = data.tcxResponses.Items.map((item) => {
                if (item.Line === itemLine) {
                    return {...item, InvoiceId: invoiceId};
                }
                return item;
            });
            await updateDoc(licensesDocRef, {tcxResponses: {Items: updatedItems}})
        } catch (error) {
            console.error('Error updating invoice ID in Item object: ', error);
        }
    };
    const showEndUserModal = () => {
        setOpenEndUserModal(!openEndUserModal);
    }
    const showUpgradeModal = () => {
        setlicenseUpgradeModal(!openLicenseUpgradeModal);
    }
    const showLicenseRenewModal = () => {
        setlicenseRenewModal(!openLicenseRenewModal);
    }
    const sortDateTime = (rowA,rowB) => {
        // Split the date strings into an array of [day, month, year]
        const a = rowA.DateTime.toLowerCase();
        const b = rowB.DateTime.toLowerCase();
        const date1 = a.split('.');
        const date2 = b.split('.');
        // Create new Date object with the year, month, day
        const newDate1 = new Date(date1[2],date1[1]-1,date1[0]);
        const newDate2 = new Date(date2[2],date2[1]-1,date2[0]);
        // Compare the two dates
        return newDate1 - newDate2;
    }


    const columns = [
        {
            width: '50px',
            cell: (row, index) => {
                return (
                    <Tooltip content="Fatura Düzenle" className="font-sm w-[125px]" animation="duration-1000">
                        <button type="button"
                                onClick={() => {
                                    setSelectedRow(index);
                                }
                                }
                                className="text-white bg-red-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                            <FaEdit/>
                        </button>
                    </Tooltip>)
            },
            hide:'sm'
        },
        {
            name: 'Fatura ID',
            center: true,
            sortable: true,
            selector: (row, index) => {

                if (selectedRow === index) {
                    // Render an input field when the row is selected
                    return (
                        <input className="w-[100px] p-1 bg-blue-500 text-white border-white border-2"
                               type="text"
                               onChange={(event) => {
                                   // Update the value of the 'InvoiceId' field when the input value changes
                                   setInvoiceId(event.target.value)
                               }}
                               onBlur={async () => {
                                   await updateInvoiceIdInItemObject(invoiceId, row.objectId, row.Line)
                                   await getFireStoreData()
                                   // Save the updated value to the database and exit edit mode when the input field loses focus
                                   setSelectedRow(null);
                               }}
                        />
                    );
                } else {
                    // Render the 'InvoiceId' value as text when the row is not selected
                    return row.InvoiceId;
                }
            },
            hide:'sm'

        },
        {
            name: 'Bayi',
            selector: row => row.ResellerName,
            sortable: true,
            grow: 2,
            filter: true,
            reorder: true
        },

        {
            name: 'End user',
            cell: (row) =>
                <button onClick={() => {
                    setendUserData(row)
                    showEndUserModal()
                    //console.log(enduserData)
                }}><AiOutlineEye className="w-7 h-7 text-red-500"/></button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            reorder: true,
            hide:'sm'
        },
        {
            name: 'İşlem Türü',
            selector: row => row.Type === 'NewLicense' ? 'Yeni Lisans' : row.Type === 'RenewAnnual' ? 'Lisans Yenileme' : row.Type === 'Maintenance' ? 'Maintenance' : 'Lisans Yükseltme',
            sortable: true,
            reorder: true,
            hide:'md'

        },
        {
            name: 'Lisans Anahtarı',
            selector: row => row.LicenseKey,
            grow: 2,
            reorder: true
        },
        {
            name: 'Lisans Tipi',
            selector: row => row.Edition,
            sortable: true,
            reorder: true,
            hide:'md'
        },
        {
            name: 'Sürüm',
            selector: row => {
                return (row.IsPerpetual ? 'Perpetual' : 'Annual')
            },
            sortable: true,
            reorder: true,
            center: true,
            hide:'md'
        },
        {
            name: 'Kanal',
            selector: row => row.SimultaneousCalls,
            sortable: true,
            reorder: true,
            center: true,
            hide:'md'
        },
        {
            name: 'Tarih',
            selector: row => row.DateTime,
            reorder: true,
            sortable: true,
           sortFunction:sortDateTime,
            hide:'md'
        },
        {
            name: 'Lisans İşlemleri',
            center: true,
            cell: (row, index) => {

                return (
                    <div className="flex">
                        <Tooltip content="Lisans Yenileme" className="font-sm" animation="duration-1000">
                            <button type="button" onClick={() => {
                                setLicenseKey(row.LicenseKey)
                                showLicenseRenewModal()
                            }
                            }
                                    className="text-white bg-red-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <TbLicense/>
                            </button>

                        </Tooltip>

                        <Tooltip
                            content="Lisans Yükseltme"
                            style="dark"
                            className="font-sm" animation="duration-1000"
                        >
                            <button type="button"
                                    onClick={() => {
                                        setLicenseKey(row.LicenseKey)
                                        showUpgradeModal()
                                    }
                                    }

                                    className="text-white bg-red-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <HiOutlineKey/>
                            </button>
                        </Tooltip>
                    </div>
                )
            },
            grow: 1.4,
            hide:'md'
        }

    ]
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

    const getFireStoreData = async () => {
        // const firestoreData = await fetch('/api/getfirestoredata');
        // const data = await firestoreData.json();
        const q = query(collection(db, "licenses"));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
            const arr = querySnapshot.docs.map((d) => ({objectId: d.id, ...d.data()}))
            const data = await extractData(arr)
            setLicenseState(data)
        });

    }
    useEffect(() => {
        (async () => {
            try {
                await getFireStoreData()
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
            <LicenseRenewModal renewalLicenseKey={licenseKey} showModal={openLicenseRenewModal}
                               closeModal={showLicenseRenewModal}/>
            <UpgradeLicenseModal upgradeLicenseKey={licenseKey} showModal={openLicenseUpgradeModal}
                                 closeModal={showUpgradeModal}/>
            <EndUserModal tableData={enduserData} showModal={openEndUserModal} closeModal={showEndUserModal}/>
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
                    defaultSortFieldId={10}
                    defaultSortAsc={false}
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