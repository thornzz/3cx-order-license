
import Navbar from "../components/Navbar";
import BuyLicenseModal from "../components/BuyLicenseModal";
import React, {useEffect, useState} from "react";
import {Button} from "flowbite-react";
import LicensesTable from "../components/LicensesTable";

const Dashboard = ()  => {

    const [openModal, setOpenModal] = useState(false);



    const showModal = ()=>{

        setOpenModal(!openModal);
    }
    return (

        <div className="bg-gray-900 h-screen w-full">

            <BuyLicenseModal showModal={openModal} closeModal={showModal}></BuyLicenseModal>

            <Navbar/>
            <div className="grid justify-items-end">
                <Button onClick={showModal} gradientDuoTone="purpleToPink"  className="px-4 w-35 mb-2 mt-2 mr-2">
                    Yeni Lisans
                </Button>
            </div>

            <LicensesTable  />
        </div>
    );
};
export default Dashboard;

