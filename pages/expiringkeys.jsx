import DataTable from 'react-data-table-component';
import React, {useEffect, useState} from "react";
import {RotatingSquare} from "react-loader-spinner";
import {getPartners} from "./api/getpartners";
import {getExpiringKeys} from "./api/getexpiringkeys";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {tableStyle} from "../components/styles/tableStyle";
import EndUserModal from "../components/EndUserModal";
import {AiOutlineEye} from "react-icons/ai";
import {collection, getDocs, query, where} from "firebase/firestore";
import {db} from "../firebase";
import {FaBook} from "react-icons/fa";
import CustomerInfoModal from "../components/CustomerInfoModal";
import {useCollection} from "react-firebase-hooks/firestore";

const ExpiringKeys = (props) => {

    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [openEndUserModal, setOpenEndUserModal] = useState(false);
    const [openCustomerInfoModal, setCustomerInfoModal] = useState(false);
    const [enduserData, setendUserData] = useState(null);
    const [customerInfo, setCustomerInfo] = useState(null);

    const showEndUserModal = () => {
        setOpenEndUserModal(!openEndUserModal);
    }
    const showCustomerInfoModal = () => {
        setCustomerInfoModal(!openCustomerInfoModal);
    }
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);

    }, [])


    const getEndUserFromFireStore = async (licenseKey) => {
        try {
            const collectionRef = collection(db, 'licenses');
            const querySnapshot = await getDocs(collectionRef)
            const data = querySnapshot.docs.map((d) => ({objectId: d.id, ...d.data()}))

            return await getEndUserByLicenseKey(data, licenseKey)

        } catch (error) {
            console.error('Error getting Item object: ', error);
        }
    };

    const getCustomerInfoFromFirestore = async (licenseKey) => {
        try {
            const collectionRef = collection(db, 'expiringkeys');
            const q = query(collectionRef, where("licenseKey", "==", licenseKey));
            const querySnapshot = await getDocs(q);
            const [customerInfoData] = querySnapshot.docs.map((d) => ({objectId: d.id, ...d.data()}))
            return customerInfoData

        } catch (error) {
            console.error('Error getting Item object: ', error);
        }
    };

    async function getEndUserByLicenseKey(data, licenseKey) {

        const tcxResponses = data.map(d => d.tcxResponses);
        const items = tcxResponses.flatMap(response => response.Items);
        const filteredItems = items.filter(item => {
            return item.LicenseKeys.some(key => key.LicenseKey === licenseKey);
        });

        if (filteredItems.length === 0) {
            return {endUser: {}}
        }

        const newLicenseItem = filteredItems.find(item => item.Type === 'NewLicense');
        if (newLicenseItem) {
            return {endUser: newLicenseItem.endUser};
        }

        const renewAnnualLicenseItem = filteredItems.find(item => item.Type === 'RenewAnnual');
        if (renewAnnualLicenseItem) {
            return {endUser: renewAnnualLicenseItem.endUser};
        }
        const upgradeLicenseItem = filteredItems.find(item => item.Type === 'Upgrade');
        if (upgradeLicenseItem) {
            return {endUser: upgradeLicenseItem.endUser};
        }
        const maintanenceLicenseItem = filteredItems.find(item => item.Type === 'Maintenance');
        if (maintanenceLicenseItem) {
            return {endUser: maintanenceLicenseItem.endUser};
        }
        return undefined;
    }

    const columns = [
        {
            width: '50px',
            cell: (row, index) => {
                return (
                    <button type="button"
                            title="Müşteri Bilgileri"
                            onClick={async () => {
                                const customerInfoData = await getCustomerInfoFromFirestore(row.LicenseKey)

                                if (customerInfoData === undefined)
                                    setCustomerInfo({ licenseKey: row.LicenseKey})
                                else
                                    setCustomerInfo(customerInfoData)

                                showCustomerInfoModal()
                            }
                            }
                            className="text-white bg-red-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        <FaBook/>
                    </button>)
            }
        },
        {
            name: 'Lisans Anahtarı',
            selector: row => row.LicenseKey,
            filter: true,
            reorder: true,
            grow:1
        },

        {
            name: 'Bayi',
            selector: (row, index) => {
                const filterPartnerName = props.partners.filter(partner => partner.value === row.ResellerID)
                if (filterPartnerName.length > 0) {
                    return filterPartnerName[0].label;
                } else {
                    return 'ResellerID bulunamadı!';
                }
            },
            sortable: true,
            reorder: true,
            grow:1
        },

        {
            name: 'End user',
            cell: (row) =>
                <button onClick={async () => {
                    setendUserData(await getEndUserFromFireStore(row.LicenseKey))
                    showEndUserModal()
                    //console.log(enduserData)
                }}><AiOutlineEye className="w-7 h-7 text-red-500"/></button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            reorder: true
        },
        {
            name:'Şirket',
            selector:row => row?.endUser?.companyName,
            grow:1
        },
        {
            name:'Telefon',
            selector:row => row?.endUser?.telephone,
            width: '100px'

        },
        {
            name: 'Kalan (Gün)',
            selector: row => {
                // Convert the string to a Date object
                const targetDate = new Date(row.ExpiryDate);
                // Get the current date
                const currentDate = new Date();
                // Calculate the difference in milliseconds between the current date and the target date
                const timeDifference = targetDate.getTime() - currentDate.getTime();
                // Calculate the number of days remaining by dividing the time difference by the number of milliseconds in a day
                return Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
            },
            reorder: true,
            sortable: true,
            center: true,
        },
        {
            name: 'Expiry Date',
            selector: row => {
                // Convert the string to a Date object
                const date = new Date(row.ExpiryDate);
                // Use the toLocaleDateString() method to format the date
                const formattedDate = date.toLocaleDateString('tr-TR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric'
                });
                // Use the toLocaleTimeString() method to format the time
                const formattedTime = date.toLocaleTimeString('tr-TR', {
                    hour: '2-digit',
                    minute: '2-digit'
                });
                // Concatenate the formatted date and time and return
                return `${formattedDate} ${formattedTime}`
            },
            reorder: true
        },
        {
            name: 'Sürüm',
            selector: row => {
                return (row.IsPerpetual ? 'Perpetual' : 'Annual')
            },
            sortable: true,
            reorder: true,
            center: true
        },
        {
            name: 'Kanal Sayısı',
            selector: row => row.SimultaneousCalls,
            sortable: true,
            reorder: true
        },
        {
            name: 'Lisans Tipi',
            selector: row => row.Type,
            sortable: true,
            reorder: true
        }

    ]
    const handleSearch = event => {
        setSearchText(event.target.value);
    };

    const filteredData = props.expiringKeys.filter(item =>
        [item.LicenseKey,item?.endUser?.companyName]
            .map(val => val?.toLowerCase())
            .some(val => val?.includes(searchText.toLowerCase()))
    );
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="bg-gray-900 h-screen">
            <Navbar/>
            <EndUserModal expiringKeysData={enduserData} showModal={openEndUserModal} closeModal={showEndUserModal}/>
            <CustomerInfoModal data={customerInfo} showModal={openCustomerInfoModal}
                               closeModal={showCustomerInfoModal}/>

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
                    paginationRowsPerPageOptions={[10, 25, 50, 100, 250, 500]}
                />
            )}
            <Footer/>
        </div>
    )
}

export default ExpiringKeys

export async function getServerSideProps(context) {
    const expiringKeysResponse = await getExpiringKeys()
    const getFirestoreDataAndMerge = async ()=> {
        const collectionRef = collection(db, 'licenses');
        const querySnapshot = await getDocs(query(collectionRef));
        const data = await querySnapshot?.docs.map((d) => ({objectId: d.id, ...d.data()}))
        const tcxResponses = data.map(d => d.tcxResponses);
        const items = tcxResponses.flatMap(response => response.Items);
        items.forEach(item => {
            expiringKeysResponse.forEach(keyResponse => {
                if (item.LicenseKeys.some(key => key.LicenseKey === keyResponse.LicenseKey)) {
                    keyResponse.endUser = item.endUser;
                }
            });
        });

    }
    await getFirestoreDataAndMerge()

    const getPartnersResponse = await getPartners()
    const getPartnersResponseFilter = getPartnersResponse.map(partner => ({
            value: parseInt(partner.PartnerId, 10),
            label: partner.CompanyName,
        })
    );
    return {
        props: {expiringKeys: expiringKeysResponse,  partners: getPartnersResponseFilter}, // will be passed to the page component as props
    }
}