import DataTable from "react-data-table-component";
import React, { useEffect, useState } from "react";
import { RotatingSquare } from "react-loader-spinner";
import { getPartners } from "./api/getpartners";
import { getExpiringKeys } from "./api/getexpiringkeys";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { tableStyle } from "../components/styles/tableStyle";
import EndUserModal from "../components/EndUserModal";
import { AiOutlineEye } from "react-icons/ai";
import { collection, getDocs, getDoc, query, where, doc } from "firebase/firestore";
import { db } from "../firebase";
import { FaBook } from "react-icons/fa";
import CustomerInfoModal from "../components/CustomerInfoModal";
import { Progress } from "flowbite-react";

const ExpiringKeys = (props) => {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const [openEndUserModal, setOpenEndUserModal] = useState(false);
  const [openCustomerInfoModal, setCustomerInfoModal] = useState(false);
  const [enduserData, setendUserData] = useState(null);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [customerInfoAll, setCustomerInfoAll] = useState(null);
  const showEndUserModal = () => {
    setOpenEndUserModal(!openEndUserModal);
  };
  const showCustomerInfoModal = () => {
    setCustomerInfoModal(!openCustomerInfoModal);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // eski sürüm için
  // const getEndUserFromFireStore = async (licenseKey) => {
  //     try {
  //         const collectionRef = collection(db, 'licenses');
  //         const querySnapshot = await getDocs(collectionRef)
  //         const data = querySnapshot.docs.map((d) => ({objectId: d.id, ...d.data()}))

  //         return await getEndUserByLicenseKey(data, licenseKey)

  //     } catch (error) {
  //         console.error('Error getting Item object: ', error);
  //     }
  // };

  const getEndUserFromFireStore = async (licenseKey) => {
    try {
      const docRef = doc(db, "endusers", licenseKey);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
       return {endUser:docSnap.data()}
      }
    } catch (error) {
      console.error("Error updating endUser in Item object: ", error);
    }
  };

  const getCustomerInfoFromFirestore = async (licenseKey) => {
    try {
      const collectionRef = collection(db, "expiringkeys");
      const q = query(collectionRef, where("licenseKey", "==", licenseKey));
      const querySnapshot = await getDocs(q);
      const [customerInfoData] = querySnapshot.docs.map((d) => ({
        objectId: d.id,
        ...d.data(),
      }));
      return customerInfoData;
    } catch (error) {
      console.error("Error getting Item object: ", error);
    }
  };

  async function getEndUserByLicenseKey(data, licenseKey) {
    const tcxResponses = data.map((d) => d.tcxResponses);
    const items = tcxResponses.flatMap((response) => response.Items);
    const filteredItems = items.filter((item) => {
      return item.LicenseKeys.some((key) => key.LicenseKey === licenseKey);
    });

    if (filteredItems.length === 0) {
      return { endUser: {} };
    }

    const newLicenseItem = filteredItems.find(
      (item) => item.Type === "NewLicense"
    );
    if (newLicenseItem) {
      return { endUser: newLicenseItem.endUser };
    }

    const renewAnnualLicenseItem = filteredItems.find(
      (item) => item.Type === "RenewAnnual"
    );
    if (renewAnnualLicenseItem) {
      return { endUser: renewAnnualLicenseItem.endUser };
    }
    const upgradeLicenseItem = filteredItems.find(
      (item) => item.Type === "Upgrade"
    );
    if (upgradeLicenseItem) {
      return { endUser: upgradeLicenseItem.endUser };
    }
    const maintanenceLicenseItem = filteredItems.find(
      (item) => item.Type === "Maintenance"
    );
    if (maintanenceLicenseItem) {
      return { endUser: maintanenceLicenseItem.endUser };
    }
    return undefined;
  }
  function countCheckedPercentage(obj) {
    let count = 0;
    let total = 0;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const element = obj[key];
        if (element.hasOwnProperty("checked")) {
          total++;
          if (element.checked === true) count++;
        }
      }
    }
    return ((count / total) * 100).toFixed(2);
  }

  const columns = [
    {
      width: "50px",
      cell: (row, index) => {
        return (
          <button
            type="button"
            onClick={async () => {
              const customerInfoData = await getCustomerInfoFromFirestore(
                row.LicenseKey
              );

              if (customerInfoData === undefined)
                setCustomerInfo({ licenseKey: row.LicenseKey });
              else setCustomerInfo(customerInfoData);

              showCustomerInfoModal();
            }}
            className="text-white bg-red-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <FaBook />
          </button>
        );
      },
      hide: "sm",
    },
    {
      name: "Lisans Anahtarı",
      selector: (row) => row.LicenseKey,
      filter: true,
      reorder: true,
      grow: 1.1,
      hide: "sm",
    },

    {
      name: "Bayi",
      selector: (row, index) => {
        const filterPartnerName = props.partners.filter(
          (partner) => partner.value === row.ResellerID
        );
        if (filterPartnerName.length > 0) {
          return filterPartnerName[0].label;
        } else {
          return "ResellerID bulunamadı!";
        }
      },
      sortable: true,
      reorder: true,
      grow: 1.3,
    },
    {
      name: "Tamamlandı",
      center: true,
      selector: (row, index) => {
        let percentage = 0;
        const item = props.customerInfoDataAll.find(
          (key) => key.licenseKey === row.LicenseKey
        );
        if (item)
          percentage = Number(countCheckedPercentage(item.customerInfo));
        return (
          <Progress
            className="w-20"
            progress={percentage}
            labelPosition="outside"
            label={" "}
            color={"blue"}
            labelProgress={true}
            size={"md"}
          />
        );
      },
      hide: "md",
    },
    {
      name: "End user",
      cell: (row) => (
        <button
          onClick={async () => {
            setendUserData(await getEndUserFromFireStore(row.LicenseKey));
            showEndUserModal();
            //console.log(enduserData)
          }}
        >
          <AiOutlineEye className="w-7 h-7 text-red-500" />
        </button>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      reorder: true,
    },
    {
      name: "Şirket",
      selector: (row) => row?.endUser?.companyName,
      grow: 1.2,
      hide: "md",
    },
    {
      name: "Telefon",
      selector: (row) => row?.endUser?.telephone,
      width: "100px",
      hide: "md",
    },
    {
      name: "Kalan (Gün)",
      selector: (row) => row.remainingDay,
      conditionalCellStyles: [
        {
          when: (row) => row.remainingDay < 31,
          style: {
            backgroundColor: "red",
            color: "white",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
        {
          when: (row) => row.remainingDay > 31,
          style: {
            backgroundColor: "orange",
            color: "white",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
        {
          when: (row) => row.remainingDay > 60,
          style: {
            backgroundColor: "green",
            color: "white",
            "&:hover": {
              cursor: "pointer",
            },
          },
        },
      ],
      reorder: true,
      sortable: true,
      center: true,
      width: "150px",
    },
    {
      name: "Expiry Date",
      selector: (row) => {
        // Convert the string to a Date object
        const date = new Date(row.ExpiryDate);
        // Use the toLocaleDateString() method to format the date
        const formattedDate = date.toLocaleDateString("tr-TR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        // Use the toLocaleTimeString() method to format the time
        const formattedTime = date.toLocaleTimeString("tr-TR", {
          hour: "2-digit",
          minute: "2-digit",
        });
        // Concatenate the formatted date and time and return
        return `${formattedDate} ${formattedTime}`;
      },
      reorder: true,
      hide: "md",
    },
    {
      name: "Sürüm",
      selector: (row) => {
        return row.IsPerpetual ? "Perpetual" : "Annual";
      },
      sortable: true,
      reorder: true,
      center: true,
      hide: "md",
    },
    {
      name: "Kanal Sayısı",
      selector: (row) => row.SimultaneousCalls,
      sortable: true,
      reorder: true,
      hide: "sm",
    },
    {
      name: "Lisans Tipi",
      selector: (row) => row.Type,
      sortable: true,
      reorder: true,
      hide: "md",
    },
  ];
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const filteredData = props.expiringKeys.filter((item) =>
    [item.LicenseKey, item?.endUser?.companyName]
      .map((val) => val?.toLowerCase())
      .some((val) => val?.includes(searchText.toLowerCase()))
  );
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="bg-gray-900 h-screen">
      <Navbar />
      <EndUserModal
        expiringKeysData={enduserData}
        showModal={openEndUserModal}
        closeModal={showEndUserModal}
      />
      <CustomerInfoModal
        data={customerInfo}
        showModal={openCustomerInfoModal}
        closeModal={showCustomerInfoModal}
      />

      {isLoading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
          noDataComponent={"Herhangi bir kayıt bulunamadı"}
          subHeader
          subHeaderComponent={
            <div style={{ display: "flex", alignItems: "center" }}>
              <h3 style={{ margin: "0 10px" }}>Ara :</h3>
              <input
                type="text"
                value={searchText}
                onChange={handleSearch}
                style={{ border: "none", borderBottom: "1px solid black" }}
              />
            </div>
          }
          pagination
          paginationComponentOptions={{
            rowsPerPageText: "Kayıt sayısı :",
            rangeSeparatorText: "/",
            noRowsPerPage: false,
            selectAllRowsItem: false,
            selectAllRowsItemText: "All",
          }}
          onChangeRowsPerPage={setRowsPerPage}
          onChangePage={setCurrentPage}
          paginationServer
          paginationTotalRows={filteredData.length}
          paginationRowsPerPageOptions={[10, 25, 50, 100, 250, 500]}
        />
      )}
      <Footer />
    </div>
  );
};

export default ExpiringKeys;

export async function getServerSideProps(context) {
  let expiringKeysResponse = await getExpiringKeys();

  const getFirestoreDataAndMerge = async () => {
    const collectionRef = collection(db, "licenses");
    //long version
    //const querySnapshot = await getDocs(query(collectionRef));
    //const data = await querySnapshot?.docs.map((d) => ({objectId: d.id, ...d.data()}))
    const data = await getDocs(query(collectionRef)).then((snapshot) =>
      snapshot.docs.map((d) => ({ objectId: d.id, ...d.data() }))
    );
    // const tcxResponses = data.map(d => d.tcxResponses);
    // const items = tcxResponses.flatMap(response => response.Items);
    const items = data.flatMap((d) => d.tcxResponses?.Items || []);

    expiringKeysResponse = expiringKeysResponse.map((keyResponse) => {
      // add remainingDay field
      const targetDate = new Date(keyResponse.ExpiryDate);
      // Get the current date
      const currentDate = new Date();
      // Calculate the difference in milliseconds between the current date and the target date
      const timeDifference = targetDate.getTime() - currentDate.getTime();
      // Calculate the number of days remaining by dividing the time difference by the number of milliseconds in a day
      keyResponse.remainingDay = Math.ceil(
        timeDifference / (1000 * 60 * 60 * 24)
      );

      let item = items.find((item) =>
        item.LicenseKeys.some(
          (key) => key.LicenseKey === keyResponse.LicenseKey
        )
      );
      if (item) keyResponse.endUser = item.endUser;

      return keyResponse;
    });
  };
  const getCustomerInfoAllData = async () => {
    const collectionRef = collection(db, "expiringkeys");
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    const customerInfoAllData = querySnapshot.docs.map((d) => ({
      objectId: d.id,
      ...d.data(),
    }));

    return customerInfoAllData;
  };
  const customerDataAll = await getCustomerInfoAllData();

  await getFirestoreDataAndMerge();

  const getPartnersResponse = await getPartners();
  const getPartnersResponseFilter = getPartnersResponse.map((partner) => ({
    value: parseInt(partner.PartnerId, 10),
    label: partner.CompanyName,
  }));
  return {
    props: {
      expiringKeys: expiringKeysResponse,
      partners: getPartnersResponseFilter,
      customerInfoDataAll: customerDataAll,
    }, // will be passed to the page component as props
  };
}
