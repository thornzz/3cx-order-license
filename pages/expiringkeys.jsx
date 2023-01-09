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
import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebase";

const ExpiringKeys = (props) => {
    const [searchText, setSearchText] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [isLoading, setIsLoading] = useState(true);
    const [openEndUserModal, setOpenEndUserModal] = useState(false);
    const [enduserData, setendUserData] = useState(null);

    const showEndUserModal = () => {
        setOpenEndUserModal(!openEndUserModal);
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
            const data = querySnapshot.docs.map((d) => ({objectId:d.id,...d.data()}))

            return getEndUserByLicenseKey(data, licenseKey)

        } catch (error) {
            console.error('Error getting Item object: ', error);
        }
    };

    function getEndUserByLicenseKey(data, licenseKey) {
        const tcxResponses = data.map(d => d.tcxResponses);
        const items = tcxResponses.flatMap(response => response.Items);
        const filteredItems = items.filter(item => {
            return item.LicenseKeys.some(key => key.LicenseKey === licenseKey);
        });

        if (filteredItems.length === 0) {
            return undefined;
        }

        const newLicenseItem = filteredItems.find(item => item.Type === 'NewLicense');
        if (newLicenseItem) {
            return newLicenseItem.endUser;
        }

        const upgradeLicenseItem = filteredItems.find(item => item.Type === 'Upgrade');
        if (upgradeLicenseItem) {
            return upgradeLicenseItem.endUser;
        }

        const renewLicenseItem = filteredItems.find(item => item.Type === 'RenewLicense');
        if (renewLicenseItem) {
            return renewLicenseItem.endUser;
        }

        const renewAnnualLicenseItem = filteredItems.find(item => item.Type === 'RenewAnnual');
        if (renewAnnualLicenseItem) {
            return renewAnnualLicenseItem.endUser;
        }

        return undefined;
    }
    const columns = [

        {
            name: 'Lisans Anahtarı',
            selector: row => row.LicenseKey,
            filter: true,
            reorder: true
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
            reorder: true
        },
        {
            name: 'End user',
            cell: (row) =>
                <button onClick={() => {
                    setendUserData(getEndUserFromFireStore(row.LicenseKey))
                    showEndUserModal()
                    //console.log(enduserData)
                }}><AiOutlineEye className="w-7 h-7 text-red-500"/></button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
            reorder: true
        },
        {
            name:'Zamanaşımına Kalan (Gün)',
            selector: row=> {
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
            center:true
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
        [item.LicenseKey]
            .map(val => val.toLowerCase())
            .some(val => val.includes(searchText.toLowerCase()))
    );
    const paginatedData = filteredData.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    return (
        <div className="bg-gray-900 h-screen">
            <Navbar/>
            <EndUserModal expiringKeysData={enduserData} showModal={openEndUserModal} closeModal={showEndUserModal}/>
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
            <Footer/>
        </div>
    )
}

export default ExpiringKeys

export async function getServerSideProps(context) {

    const expiringKeysResponse = await getExpiringKeys()
    const getPartnersResponse = await getPartners()

    const getPartnersResponseFilter = getPartnersResponse.map(partner => ({
            value: parseInt(partner.PartnerId, 10),
            label: partner.CompanyName,
        })
    );
    return {
        props: {expiringKeys: expiringKeysResponse, partners: getPartnersResponseFilter}, // will be passed to the page component as props
    }
}