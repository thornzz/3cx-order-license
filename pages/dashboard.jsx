import Navbar from "../components/Navbar";
import BuyLicenseModal from "../components/BuyLicenseModal";
import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import LicensesTable from "../components/LicensesTable";
import LicenseRenewModal from "../components/LicenseRenewModal";
import UpgradeLicenseModal from "../components/UpgradeLicenseModal";
import { MagnifyingGlass } from "react-loader-spinner";
import Footer from "../components/Footer";
import LicenseCheckModal from "../components/LicenseCheckModal";
import AddEndUserModal from "../components/AddEndUserModal";
import { ButtonGroup, Spacer, VStack, HStack } from "@chakra-ui/react";

const Dashboard = () => {
  const [openNewLicenseModal, setOpenNewLicenseModal] = useState(false);
  const showNewLicenseModal = () => {
    setOpenNewLicenseModal(!openNewLicenseModal);
  };
  const [openAddEndUserModal, setOpenAddEndUserModal] = useState(false);
  const showAddEndUserModal = () => {
    setOpenAddEndUserModal(!openAddEndUserModal);
  };
  const [openUpgradeLicenseModal, setOpenUpgradeLicenseModal] = useState(false);
  const showUpgradeLicenseModal = () => {
    setOpenUpgradeLicenseModal(!openUpgradeLicenseModal);
  };
  const [openRenewLicenseModal, setRenewLicenseModal] = useState(false);
  const showRenewLicenseModal = () => {
    setRenewLicenseModal(!openRenewLicenseModal);
  };

  const [licenseKey, setLicenseKey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const showLicenseCheckModal = () => {
    setLicenseCheckModal(!openLicenseCheckModal);
  };
  const [openLicenseCheckModal, setLicenseCheckModal] = useState(false);
  const [orderStatus, setOrderStatus] = useState(false);
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resOrderApiStatus = await fetch('/api/getapistatus');
        const orderApiStatus = await resOrderApiStatus.json();
        setOrderStatus(orderApiStatus.status);
        
      } catch (error) {
        console.error('Error fetching API status:', error);
      }
    };
  
    fetchData();
  
  }, [orderStatus]); 
  


  return (
    <div className={isLoading ? "h-screen login" : "h-screen bg-gray-900"}>
      {/* {!isLoading && ( */}
      {isLoading ? (
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
     <MagnifyingGlass
  visible={true}
  height="80"
  width="80"
  ariaLabel="MagnifyingGlass-loading"
  wrapperStyle={{}}
  wrapperClass="MagnifyingGlass-wrapper"
  glassColor = '#c0efff'
  color = '#e15b64'
/>
    </div>
      ) : (
      <div>
      <AddEndUserModal
        showModal={openAddEndUserModal}
        closeModal={showAddEndUserModal}
      ></AddEndUserModal>
      <BuyLicenseModal
        showModal={openNewLicenseModal}
        closeModal={showNewLicenseModal}
      ></BuyLicenseModal>

      <LicenseRenewModal
        showModal={openRenewLicenseModal}
        renewalLicenseKey={{
          licenseKey: licenseKey,
          setLicenseKey: setLicenseKey,
        }}
        closeModal={showRenewLicenseModal}
      ></LicenseRenewModal>
      <LicenseCheckModal
        showModal={openLicenseCheckModal}
        setLicenseKey={setLicenseKey}
        closeModal={showLicenseCheckModal}
        showRenewModal={showRenewLicenseModal}
        showUpgradeModal={showUpgradeLicenseModal}
      ></LicenseCheckModal>
      <UpgradeLicenseModal
        showModal={openUpgradeLicenseModal}
        upgradeLicenseKey={{
          licenseKey: licenseKey,
          setLicenseKey: setLicenseKey,
        }}
        closeModal={showUpgradeLicenseModal}
      ></UpgradeLicenseModal>

<Navbar />
<HStack>
  <ButtonGroup ml={2}>
    <Button
      onClick={showLicenseCheckModal}
      className={`bg-sky-500 px-4 w-35 mb-2 mt-2 mr-2 ${!orderStatus ? 'disabled' : ''}`}
      disabled={!orderStatus}
    >
      Lisans Sorgulama
    </Button>
    <Button
      onClick={showAddEndUserModal}
      className={`px-4 w-35 mb-2 mt-2 mr-2 bg-orange-400 ${!orderStatus ? 'disabled' : ''}`}
      disabled={!orderStatus}
    >
      End User Ekle
    </Button>
  </ButtonGroup>
  <Spacer />

  <ButtonGroup>
    <Button
      onClick={showRenewLicenseModal}
      className={`bg-red-500 px-4 w-35 mb-2 mt-2 mr-2 ${!orderStatus ? 'disabled' : ''}`}
      disabled={!orderStatus}
    >
      Lisans Yenileme
    </Button>
    <Button
      onClick={showUpgradeLicenseModal}
      className={`bg-green-500 px-4 w-35 mb-2 mt-2 mr-2 ${!orderStatus ? 'disabled' : ''}`}
      disabled={!orderStatus}
    >
      Lisans Yükseltme
    </Button>
  </ButtonGroup>

  <Button
    style={{ marginRight: "10px", marginLeft: "150px" }}
    onClick={showNewLicenseModal}
    className={`bg-indigo-500 px-9 w-35 mb-2 mt-2 mr-2 ${!orderStatus ? 'disabled' : ''}`}
    disabled={!orderStatus}
  >
    Yeni Lisans
  </Button>
</HStack>
      </div>
      )}
      <div style={{ minHeight: '720px' }}>
        <LicensesTable setLoadingState={setIsLoading} />
      </div>
      <div className="w-full items-center">
      {isLoading ? (
        null) : (<Footer />)}
      </div>
    
    </div>
    
  );
};
export default Dashboard;
