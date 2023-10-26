import Navbar from "../components/Navbar";
import BuyLicenseModal from "../components/BuyLicenseModal";
import React, { useEffect, useState } from "react";
import { Button } from "flowbite-react";
import LicensesTable from "../components/LicensesTable";
import LicenseRenewModal from "../components/LicenseRenewModal";
import UpgradeLicenseModal from "../components/UpgradeLicenseModal";

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

  const showLicenseCheckModal = () => {
    setLicenseCheckModal(!openLicenseCheckModal);
  };
  const [openLicenseCheckModal, setLicenseCheckModal] = useState(false);

  return (
    <div className="bg-gray-900 h-screen">
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
            className="bg-sky-500 px-4 w-35 mb-2 mt-2 mr-2"
          >
            Lisans Sorgulama
          </Button>
          <Button
            onClick={showAddEndUserModal}
            className="px-4 w-35 mb-2 mt-2 mr-2 bg-orange-400"
          >
            End User Ekle
          </Button>
        </ButtonGroup>
        <Spacer />

        <ButtonGroup>
          <Button
            onClick={showRenewLicenseModal}
            className="bg-red-500 px-4 w-35 mb-2 mt-2 mr-2"
          >
            Lisans Yenileme
          </Button>
          <Button
            onClick={showUpgradeLicenseModal}
            className="bg-green-500 px-4 w-35 mb-2 mt-2 mr-2"
          >
            Lisans Yükseltme
          </Button>
        </ButtonGroup>

        <Button
          style={{ marginRight: "10px", marginLeft: "150px" }}
          onClick={showNewLicenseModal}
          className="bg-indigo-500 px-9 w-35 mb-2 mt-2 mr-2"
        >
          Yeni Lisans
        </Button>
      </HStack>

      {/* <div className="flex items-center justify-between">
        <div className="flex">
          <Button
            onClick={showLicenseCheckModal}
            className="bg-sky-500 px-4 w-35 mb-2 mt-2 mr-2"
          >
            Lisans Sorgulama
          </Button>
          <Button
            onClick={showAddEndUserModal}
            className="px-4 w-35 mb-2 mt-2 mr-2 bg-orange-400"
          >
            End User Ekle
          </Button>
        </div>
      

        <div className="flex">
          <Button
            onClick={showRenewLicenseModal}
            className="bg-red-500 px-4 w-35 mb-2 mt-2 mr-2"
          >
            Lisans Yenileme
          </Button>
          <Button
            onClick={showUpgradeLicenseModal}
            className="bg-green-500 px-4 w-35 mb-2 mt-2 mr-2"
          >
            Lisans Yükseltme
          </Button>
          <div className="ml-40">
        <Button
            onClick={showNewLicenseModal}
            className="bg-indigo-500 px-9 w-35 mb-2 mt-2 mr-2"
          >
            Yeni Lisans
          </Button>
          </div>
        </div>
       
      </div> */}

      <div style={{ minHeight:'720px'}}>
        <LicensesTable />
      </div>

      <Footer />
    </div>
  );
};
export default Dashboard;
