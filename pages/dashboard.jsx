
import Navbar from "../components/Navbar";
import BuyLicenseModal from "../components/BuyLicenseModal";
import React, {useEffect, useState} from "react";
import {Button} from "flowbite-react";
import LicensesTable from "../components/LicensesTable";
import LicenseRenewModal from "../components/LicenseRenewModal";
import UpgradeLicenseModal from "../components/UpgradeLicenseModal";
import {useSession} from "next-auth/react";

const Dashboard = ()  => {

    const {data:session} = useSession()

    console.log('session',session)

    const [openNewLicenseModal, setOpenNewLicenseModal] = useState(false);
    const showNewLicenseModal = ()=>{

        setOpenNewLicenseModal(!openNewLicenseModal);
    }
    const [openUpgradeLicenseModal, setOpenUpgradeLicenseModal] = useState(false);
    const showUpgradeLicenseModal = ()=>{

        setOpenUpgradeLicenseModal(!openUpgradeLicenseModal);
    }
    const [openRenewLicenseModal, setRenewLicenseModal] = useState(false);
    const showRenewLicenseModal = ()=>{

        setRenewLicenseModal(!openRenewLicenseModal);
    }
    return (

        <div className="bg-gray-900 h-screen">

            <BuyLicenseModal showModal={openNewLicenseModal} closeModal={showNewLicenseModal}></BuyLicenseModal>

            <LicenseRenewModal showModal={openRenewLicenseModal} closeModal={showRenewLicenseModal}></LicenseRenewModal>

            <UpgradeLicenseModal showModal={openUpgradeLicenseModal} closeModal={showUpgradeLicenseModal}></UpgradeLicenseModal>

            <Navbar/>

            <div className="flex justify-end ">


                <Button onClick={showNewLicenseModal}  className="bg-sky-500 px-9 w-35 mb-2 mt-2 mr-2">
                    Yeni Lisans
                </Button>
                <Button onClick={showRenewLicenseModal}   className="bg-red-500 px-4 w-35 mb-2 mt-2 mr-2">
                    Lisans Yenileme
                </Button>
                <Button onClick={showUpgradeLicenseModal}  className="bg-green-500 px-4 w-35 mb-2 mt-2 mr-2">
                    Lisans Yükseltme
                </Button>
            </div>



            <LicensesTable  />
        </div>
    );
};
export default Dashboard;

