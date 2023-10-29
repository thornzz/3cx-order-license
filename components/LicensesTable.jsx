import DataTable from "react-data-table-component";
import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { tableStyle } from "./styles/tableStyle";
import { useRecoilState } from "recoil";
import { licenses } from "../atoms/fireStoreDataAtom";
import { RotatingSquare } from "react-loader-spinner";
import { AiOutlineEye } from "react-icons/ai";
import { RxClipboardCopy } from "react-icons/rx";
import EndUserModal from "./EndUserModal";
import { TbLicense } from "react-icons/tb";
import { FaEdit } from "react-icons/fa";
import { HiOutlineKey } from "react-icons/hi";
import { SiMinutemailer } from "react-icons/si";
import LicenseRenewModal from "./LicenseRenewModal";
import UpgradeLicenseModal from "./UpgradeLicenseModal";
import { db } from "../firebase";
import { Icon, Spacer, Text, useToast } from "@chakra-ui/react";
import { ImQrcode } from "react-icons/im";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import extractData from "../utility/extractFirestoreData";
import { Tooltip } from "flowbite-react";
import {
  HStack,
  FormControl,
  Input,
  Stack,
  Button,
  useDisclosure,
  Checkbox,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalCloseButton,
  Flex,
  Box
} from "@chakra-ui/react";
import { z } from "zod";
import mergeEndUserwithLicense from "../utility/mergeEndUserwithLicense";
import { MultiSelect } from "chakra-multiselect";

const sortDateTime = (rowA, rowB) => {
  let moment = require("moment");
  return (
    moment(rowA.DateTime, "DD.MM.YYYY").unix() -
    moment(rowB.DateTime, "DD.MM.YYYY").unix()
  );
};

const LicensesTable = (props) => {
  const [searchText, setSearchText] = useState("");
  const [licenseState, setLicenseState] = useRecoilState(licenses);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [openEndUserModal, setOpenEndUserModal] = useState(false);
  const [enduserData, setendUserData] = useState(null);
  const [allEnduserData, setallEnduserData] = useState([]);
  const [licenseKey, setLicenseKey] = useState(null);
  const [couponwithPartnerData, setCouponwithPartnerData] = useState({});
  const [openLicenseRenewModal, setlicenseRenewModal] = useState(null);
  const [openLicenseUpgradeModal, setlicenseUpgradeModal] = useState(null);
  const [invoiceId, setInvoiceId] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCouponData, setSelectedCouponData] = useState({});
  const [showAltEmailInput, setShowAltEmailInput] = useState(false);
  const [altEmailText, setAltEmailText] = useState("");
  const [selectedFilter, setSelectedFilter] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const optionsFilter =
    [{ label: "Fatura Kesilmeyen", value: "faturasiz" }]

  const columns = [
    {
      width: "50px",
      cell: (row, index) => {
        return (
          <Tooltip
            content="Fatura Düzenle"
            className="font-sm w-[125px]"
            animation="duration-1000"
          >
            <button
              type="button"
              onClick={() => {
                setSelectedRow(index);
              }}
              className="text-white bg-red-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              <FaEdit />
            </button>
          </Tooltip>
        );
      },
      hide: "sm",
    },
    {
      name: "Fatura ID",
      center: true,
      sortable: true,
      selector: (row, index) => {
        if (selectedRow === index) {
          // Render an input field when the row is selected
          return (
            <input
              autoFocus
              className="w-[100px] p-1 bg-blue-500 text-white border-white border-2"
              type="text"
              onChange={(event) => {
                // Update the value of the 'InvoiceId' field when the input value changes
                setInvoiceId(event.target.value);
              }}
              onBlur={async () => {
                await updateInvoiceIdInItemObject(
                  invoiceId,
                  row.objectId,
                  row.Line
                );
                await getFireStoreData();
                // Save the updated value to the database and exit edit mode when the input field loses focus
                setSelectedRow(null);
              }}
              onKeyDown={async (event) => {
                if (event.key === "Enter") {
                  await updateInvoiceIdInItemObject(
                    invoiceId,
                    row.objectId,
                    row.Line
                  );
                  await getFireStoreData();
                  // Save the updated value to the database and exit edit mode when the input field loses focus
                  setSelectedRow(null);
                }
              }}
            />
          );
        } else {
          // Render the 'InvoiceId' value as text when the row is not selected
          return row.InvoiceId;
        }
      },
      hide: "sm",
    },
    {
      name: "Bayi",
      selector: (row) => row.ResellerName,
      sortable: true,
      grow: 2,
      filter: true,
      reorder: true,
    },

    {
      name: "End User",
      cell: (row) => {
        const endUser = allEnduserData.find(
          (user) => user.licenseKey === row.LicenseKey
        );
        return (
          <button
            onClick={async () => {
              // const endUser = await getEndUserFromFireStore(row.LicenseKey)
              if (endUser) {
                setendUserData({ endUser: endUser });
              } else {
                setendUserData({
                  endUser: {
                    licenseKey: row.LicenseKey,
                    companyName: "",
                    email: "",
                    address: "",
                    telephone: "",
                    other: "",
                  },
                });
              }
              showEndUserModal();
              //console.log(enduserData)
            }}
          >
            <AiOutlineEye
              className={
                endUser?.licenseKey
                  ? "w-7 h-7 text-blue-500"
                  : "w-7 h-7 text-red-500"
              }
            />
          </button>
        );
      },
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      reorder: true,
      hide: "sm",
    },
    {
      name: "İşlem Türü",
      selector: (row) =>
        row.Type === "NewLicense"
          ? "Yeni Lisans"
          : row.Type === "RenewAnnual"
            ? "Lisans Yenileme"
            : row.Type === "Maintenance"
              ? "Maintenance"
              : "Lisans Yükseltme",
      sortable: true,
      reorder: true,
      hide: "md",
    },
    {
      name: "Lisans Anahtarı",
      cell: (row) => {
        return (
          <>
            <Icon
              as={RxClipboardCopy}
              boxSize="6"
              color={"red.500"}
              _hover={{
                cursor: "pointer",
                color: "blue.500",
              }}
              onClick={() => {
                navigator.clipboard.writeText(row.LicenseKey);
                toast({
                  title: "Anahtar kopyalandı",
                  status: "info",
                  duration: 1000,
                  isClosable: true,
                });
              }}
            />
            <Text ml={2}>{row.LicenseKey}</Text>
          </>
        );
      },
      grow: 2,
      reorder: true,
    },
    {
      name: "Lisans Tipi",
      selector: (row) => row.Edition,
      sortable: true,
      reorder: true
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
      name: "Kanal",
      selector: (row) => row.SimultaneousCalls,
      sortable: true,
      reorder: true,
      center: true,
    },
    {
      name: "Tarih",
      selector: (row) => row.DateTime,
      reorder: true,
      sortable: true,
      sortFunction: sortDateTime
    },
    {
      name: "Lisans İşlemleri",
      center: true,
      cell: (row, index) => {
        return (
          <div className="flex">
            <Tooltip
              content="Lisans Yenileme"
              className="font-sm"
              animation="duration-500"
            >
              <button
                type="button"
                onClick={() => {
                  setLicenseKey({ licenseKey: row.LicenseKey });
                  showLicenseRenewModal();
                }}
                className="text-white bg-red-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <TbLicense />
              </button>
            </Tooltip>

            <Tooltip
              content="Lisans Yükseltme"
              style="dark"
              className="font-sm"
              animation="duration-500"
            >
              <button
                type="button"
                onClick={() => {
                  setLicenseKey({ licenseKey: row.LicenseKey });
                  showUpgradeModal();
                }}
                className="text-white bg-red-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                <HiOutlineKey />
              </button>
            </Tooltip>

            <Tooltip
              content="Kupon Kodu Gönder"
              style="dark"
              className="font-sm"
              animation="duration-500"
            >
              <button
                type="button"
                className="text-white bg-red-500 hover:bg-blue-500 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={() => {
                  const { LicenseKey } = row;
                  const couponData = couponwithPartnerData.find((c) => c.licenseKey === LicenseKey);
                  if (couponData) {
                    setSelectedCouponData(couponData);
                    onOpen();
                  } else {
                    toast({
                      title: "Bu lisans key için kod bulunamadı.!",
                      status: "error",
                      position: 'top',
                      duration: 2000,
                      isClosable: true,
                    });
                  }
                }}
              >
                <SiMinutemailer />
              </button>
            </Tooltip>
          </div>
        );
      },
      grow: 1.4,
      hide: "md",
    },
  ];

  const updateInvoiceIdInItemObject = async (
    invoiceId,
    documentId,
    itemLine
  ) => {
    try {
      const licensesDocRef = doc(db, "licenses", documentId);
      const docSnap = await getDoc(licensesDocRef);
      const data = docSnap.data();

      const updatedItems = data.tcxResponses.Items.map((item) => {
        if (item.Line === itemLine) {
          return { ...item, InvoiceId: invoiceId };
        }
        return item;
      });
      await updateDoc(licensesDocRef, {
        tcxResponses: { Items: updatedItems },
      });
    } catch (error) {
      console.error("Error updating invoice ID in Item object: ", error);
    }
  };

  // const getEndUserFromFireStore = async (licenseKey) => {
  //   try {
  //     const docRef = doc(db, "endusers", licenseKey);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       return { endUser: docSnap.data() };
  //     }
  //   } catch (error) {
  //     console.error("Error updating endUser in Item object: ", error);
  //   }
  // };

  const showEndUserModal = () => {
    setOpenEndUserModal(!openEndUserModal);
  };
  const showUpgradeModal = () => {
    setlicenseUpgradeModal(!openLicenseUpgradeModal);
  };
  const showLicenseRenewModal = () => {
    setlicenseRenewModal(!openLicenseRenewModal);
  };

  const handleAltEmailText = (event) => {
    setAltEmailText(event.target.value);
  };
  const handleAltEmailCheckbox = (event) => {
    if (!event.target.checked)
      setAltEmailText("")
    setShowAltEmailInput(event.target.checked);
  };
  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  const handleEmailSend = async () => {
    if (altEmailText.trim() === '') {
      // altEmailText boşsa, doğrudan e-posta gönderme işlemine geç
      sendEmail();
    } else {
      const emailScheme = z.string().email({ message: 'Mail adresi geçersiz' });
      // altEmailText doluysa, zod ile kontrol yap
      const emailValidate = emailScheme.safeParse(altEmailText);
      if (emailValidate.success === false) {
        toast({
          title: "Geçersiz e-posta adresi!",
          status: "error",
          position: 'top',
          duration: 2000,
          isClosable: true,
        });
      } else {
        // E-posta gönderme işlemi
        await sendEmail();
      }
    }
  }

  const sendEmail = async () => {
    const emailRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "mustafa@k2mbilisim.com", // Burada gönderilecek e-posta adresini değiştirebilirsiniz
        coupon: selectedCouponData.couponCode,
        cc: altEmailText,
      }),
    };
    const emailResponse = await fetch(
      "/api/coupon/sendmail",
      emailRequestOptions
    ).then((response) => {
      if (!response.ok) {
        throw Error("HTTP hata, durum kodu: " + response.status);
      }
      return response.json();
    }).then((data) => {
      toast({
        title: "E-posta gönderimi tamamlandı.",
        status: "info",
        position: 'top',
        duration: 2000,
        isClosable: true,
      });
      setShowAltEmailInput(false);
      setAltEmailText("");
      onClose();
      console.log("Başarılı yanıt:", data);
    }).catch((error) => {
      toast({
        title: "E-posta gönderiminde bir hata oluştu.",
        status: "error",
        position: 'top',
        duration: 2000,
        isClosable: true,
      });
      console.error("Hata:", error);
    });
  }

  const filteredData = licenseState.filter((item) =>
    [item.ResellerName, item.LicenseKey, item.DateTime, item.companyName]
      .map((val) => val.toLowerCase())
      .some((val) => val.includes(searchText.toLowerCase()))
  );
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );


  useEffect(() => {
    (async () => {
      try {

        // get firestore data

        const c = query(collection(db, "coupons"));
        const couponsSnapshot = await getDocs(c);
        const couponsData = couponsSnapshot.docs.map((d) => ({ ...d.data() }))
        const resPartners = await fetch('/api/getpartners');
        const partners = await resPartners.json();

        const couponsWithPartnerData = couponsData.map((coupon) => {
          const partner = partners.find((p) => p.PartnerId === coupon.partnerId);
          return {
            partnerId: coupon.partnerId,
            couponCode: coupon.couponCode,
            licenseKey: coupon.licensekey,
            email: partner ? partner.Email : null,
          };
        });

        setCouponwithPartnerData(couponsWithPartnerData);
        let fireStoreData;
        const q = query(collection(db, "licenses"));
        const unsubscribe = onSnapshot(q, async (querySnapshot) => {
          const arr = querySnapshot.docs.map((d) => ({
            objectId: d.id,
            ...d.data(),
          }));

          fireStoreData = await extractData(arr);

        });


        const getEndUsers = async () => {
          const collectionRef = collection(db, "endusers");
          const q = query(collectionRef);
          const querySnapshot = await getDocs(q);
          const endUserAllData = querySnapshot.docs.map((d) => ({
            ...d.data(),
          }));
          return endUserAllData;
        };
        const allEndUserData = await getEndUsers();

        //end user bilgisi lisans datasının içine aktar

        const mergedData = await mergeEndUserwithLicense(fireStoreData, allEndUserData);
        console.log("🚀 ~ file: LicensesTable.jsx:551 ~ mergedData:", mergedData)


        setLicenseState(mergedData);
        setallEnduserData(allEndUserData);

        const timer = setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <div>
      {/* Resend Coupon Modal */}
      <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <HStack mb={1}>
              <ImQrcode />
              <Text>Promosyon Kodu</Text>
            </HStack>
          </ModalHeader>

          <ModalBody pb={4}>
            <Stack>
              <Checkbox
                colorScheme="red"
                size="md"
                onChange={handleAltEmailCheckbox}
              >
                Alternatif email ekle
              </Checkbox>
              {showAltEmailInput && (
                <FormControl>
                  <Input
                    placeholder="Alternatif email"
                    onChange={handleAltEmailText}
                    type="email"
                  />
                </FormControl>
              )}
            </Stack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={handleEmailSend}
            >
              Gönder
            </Button>
            <Button
              colorScheme="red"
              onClick={(e) => {
                setShowAltEmailInput(false);
                setAltEmailText("");
                onClose();
              }}
            >
              İptal
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Resend Coupon Modal */}

      <LicenseRenewModal
        renewalLicenseKey={licenseKey}
        showModal={openLicenseRenewModal}
        closeModal={showLicenseRenewModal}
      />
      <UpgradeLicenseModal
        upgradeLicenseKey={licenseKey}
        showModal={openLicenseUpgradeModal}
        closeModal={showUpgradeModal}
      />
      <EndUserModal
        tableData={enduserData}
        showModal={openEndUserModal}
        closeModal={showEndUserModal}
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


          defaultSortFieldId={10}
          defaultSortAsc={false}
          columns={columns}
          data={paginatedData}
          customStyles={tableStyle}
          highlightOnHover={true}
          noDataComponent={"Herhangi bir kayıt bulunamadı"}
          subHeader={true}
          subHeaderAlign="left"

          subHeaderComponent={
            <div style={{ display: "flex" }}>

              <div style={{ marginRight: '45vw', display: "flex", alignItems: 'center', width: '750px' }}>
                <h3 style={{ marginRight: '10px' }}>Filtrele :</h3>
                <MultiSelect
                  options={optionsFilter}
                  value={selectedFilter}

                  onChange={setSelectedFilter}
                />
              </div>
              <div style={{ display: "flex", alignItems: 'center', marginLeft: 'auto' }}>
                <h3 style={{ marginRight: '10px' }}>Ara :</h3>
                <input
                  type="text"
                  value={searchText}
                  onChange={handleSearch}
                  style={{ border: "none", borderBottom: "1px solid black" }}
                />
              </div>
            </div>


            //   <input
            //   type="text"
            //   value={searchText}
            //   onChange={handleSearch}
            //   style={{ border: "none", borderBottom: "1px solid black" }}
            // />
            // <div style={{ display: "flex", justifyContent: "space-between" }}>

            //   <MultiSelect
            //             options={optionsFilter}
            //             value={selectedFilter}

            //             onChange={setSelectedFilter}
            //           />
            //   <h3 style={{ margin: "0 10px" }}>Ara :</h3>
            //   <Spacer />
            //   <input
            //     type="text"
            //     value={searchText}
            //     onChange={handleSearch}
            //     style={{ border: "none", borderBottom: "1px solid black" }}
            //   />
            // </div>
          }
          pagination
          paginationComponentOptions={{
            rowsPerPageText: "Kayıt sayısı :",
            rangeSeparatorText: "/",
            noRowsPerPage: false,
            noRowsPerPage: false,
            selectAllRowsItem: false,
            selectAllRowsItemText: "All",
          }}
          onChangeRowsPerPage={setRowsPerPage}
          onChangePage={setCurrentPage}
          paginationPerPage={rowsPerPage}
          paginationTotalRows={filteredData.length}
          paginationServer
          paginationRowsPerPageOptions={[50, 100, 250, 500]}
        />
      )}
    </div>
  );
};

export default LicensesTable;
