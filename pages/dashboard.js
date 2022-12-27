
import Navbar from "../components/Navbar";
import DataTable from "../components/DataTable";
import BuyLicenseModal from "../components/BuyLicenseModal";
import React, {useEffect, useState} from "react";
import {Button} from "flowbite-react";

const Dashboard = () => {
    const [openModal, setOpenModal] = useState(false);
    const showModal = ()=>{

        setOpenModal(!openModal);
    }
    return (

        <div className="bg-gray-800 h-screen">

            <BuyLicenseModal showModal={openModal} closeModal={showModal}></BuyLicenseModal>

            <Navbar/>
            <div className="grid justify-items-end">
                <Button onClick={showModal} gradientDuoTone="purpleToPink"  className="px-4 w-35 mb-2 mt-2 mr-2">
                    Yeni Lisans
                </Button>
            </div>

            <DataTable/>

        </div>
    );
};
export default Dashboard;