
import Navbar from "../components/Navbar";
import DataTable from "../components/DataTable";
import BuyLicenseModal from "../components/BuyLicenseModal";
import React, {useEffect, useState} from "react";
import {Button, Footer} from "flowbite-react";
import {db} from '../firebase/index';
import {collection,getDocs} from "firebase/firestore";

const Dashboard = () => {
    const dbInstance = collection(db, 'licenses');
    const [data,setData] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    useEffect( () => {
       getData()
    }, [])

    const getData = () => {
        getDocs(dbInstance)
            .then((data) => {
                setData(data.docs.map((item) => {
                    return { ...item.data(), id: item.id }
                }));
            })
    }
    const showModal = ()=>{

        setOpenModal(!openModal);
    }
    return (

        <div className="bg-gray-800 h-screen w-full">

            <BuyLicenseModal showModal={openModal} closeModal={showModal}></BuyLicenseModal>

            <Navbar/>
            <div className="grid justify-items-end">
                <Button onClick={showModal} gradientDuoTone="purpleToPink"  className="px-4 w-35 mb-2 mt-2 mr-2">
                    Yeni Lisans
                </Button>
            </div>

            <DataTable data={data}/>

            <Footer/>

        </div>
    );
};
export default Dashboard;