import React, { useEffect, useState } from "react";
import { db } from "../firebase/index";
import { toast } from "react-toastify";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  deleteDoc,
  getDocs,
  query,
  onSnapshot,
} from "firebase/firestore";
import { Container, Button, HStack } from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import Navbar from "../components/Navbar";
import { Tag, TagLabel, TagCloseButton, Wrap } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Box,
  Text,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { AiOutlineEye } from "react-icons/ai";
import { IoRepeat } from "react-icons/io5";
import { FcCancel } from "react-icons/fc";

import Link from "next/link";

export const ChipEmail = ({ email }) => (
  <Tag key={email} borderRadius="full" variant="solid" colorScheme="green">
    <TagLabel>{email}</TagLabel>
  </Tag>
);

export const ChipListEmail = ({ emails = [] }) => (
  <Wrap spacing={1} mb={3}>
    {emails.map((email) => (
      <ChipEmail email={email} key={email} />
    ))}
  </Wrap>
);

export const ChipPartnerLevel = ({ level }) => {
  // Define color mappings for each level
  const colorMap = {
    Trainee: "lightgray",
    Bronze: "#CD7F32", // Bronze color
    Silver: "#C0C0C0", // Silver color
    Gold: "#FFD700", // Gold color
    Platinum: "#E5E4E2", // Platinum color
    Titanium: "#87868A", // Titanium color
  };

  // Get the color for the current level
  const color = colorMap[level] || "gray.500"; // Default to gray if the level is not found

  return (
    <Tag
      key={level}
      borderRadius="full"
      variant="solid"
      style={{ backgroundColor: color }}
    >
      <TagLabel>{level}</TagLabel>
    </Tag>
  );
};
export const ChipListPartnerLevel = ({ partners = [] }) => (
  <Wrap spacing={1} mb={3}>
    {partners.map((partner) => (
      <ChipPartnerLevel level={partner.label} key={partner.value} />
    ))}
  </Wrap>
);
const MailHistory = (props) => {
  const [_document, set_document] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [mailContent, setMailContent] = useState("");
  const [mailTitle, setMailTitle] = useState("");
  const [mailHistoryData, setmailHistoryData] = useState("");
  const moment = require("moment");
  const handleShowMailContent = (requestObject) => {
    setMailContent(requestObject.content);
    setMailTitle(requestObject.title);
    onOpen();
  };

  const getMailHistoryData = async () => {
    // const firestoreData = await fetch('/api/getfirestoredata');
    // const data = await firestoreData.json();
    const q = query(collection(db, "mailhistory"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const arr = querySnapshot.docs.map((d) => ({
        objectId: d.id,
        ...d.data(),
      }));

      setmailHistoryData(arr);
    });
  };

  const handleCancelMailRequest = async (row) => {
    row.requestObj.status = "Canceled";
    row.requestObj.token = "123456789";

    if (row && row.objectId) {
      const documentRef = doc(db, "mailhistory", row.objectId);

      await deleteDoc(documentRef)
        .then(() => {
          console.log("Document successfully deleted!");
        })
        .catch((error) => {
          console.error("Error deleting document:", error);
        });
    } else {
      console.error("Invalid requestObject or missing 'id' property.");
    }

    const response = await fetch("/api/sendmail/partners/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(row.requestObj),
    });

    if (response.ok) {
      toast.success("Mail iptali başarıyla tamamlandı", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      toast.error("Mail iptali başarısız oldu", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    set_document(document);
    (async () => {
      try {
        await getMailHistoryData();
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  const sortDateTime = (rowA, rowB) => {
    let moment = require("moment");
    return (
      moment(rowA.requestObj.DateTime, "DD.MM.YYYY hh:mm").unix() -
      moment(rowB.requestObj.DateTime, "DD.MM.YYYY hh:mm").unix()
    );
  };

  const columns = [
    {
      name: "Mail Başlığı",
      selector: (row) => row.requestObj.title,
    },
    {
      name: "Mail İçeriği",
      cell: (row) => {
        if (typeof document !== "undefined" && _document !== null) {
          // Extract the text content from the HTML string
          const htmlContent = _document.createElement("div");
          htmlContent.innerHTML = row.requestObj.content;
          const textContent = htmlContent.textContent || "";
          // Get the first 100 characters
          const truncatedText = textContent.slice(0, 100);
          // Create a React fragment to render
          return (
            <>
              {truncatedText}
              {textContent.length > 100 ? "..." : ""}
            </>
          );
        }
      },
    },
    {
      name: "Partner Seviyesi",
      cell: (row) => (
        <ChipListPartnerLevel partners={row.requestObj.selectedPartner} />
      ),
    },
    {
      name: "Opsiyonel E-Posta",
      cell: (row) => (
        <ChipListEmail emails={row.requestObj.optionalPartnerEmails} />
      ),
    },
    {
      name: "Tarih",
      selector: (row) => row.requestObj.DateTime,
      sortable: true,
      sortFunction: sortDateTime,
    },
    {
      name: "İşlemler",
      cell: (row) => {
        const now = moment();
        const requestDateTime = moment(
          row.requestObj.DateTime,
          "DD.MM.YYYY HH:mm"
        );
        const timeDifference = now.diff(requestDateTime, "minutes");

        return (
          <HStack spacing="15px">
            <Link
              href={{
                pathname: "/partnersmailinglist",
                query: {
                  mail_id: row.objectId,
                },
              }}
            >
              <IconButton
                aria-label="Göster"
                icon={<IoRepeat className="w-7 h-7 text-red-500" />}
              />
            </Link>
            <IconButton
              aria-label="Göster"
              icon={<AiOutlineEye className="w-7 h-7 text-blue-500" />}
              onClick={() => handleShowMailContent(row.requestObj)}
            />

            {timeDifference >= 0 && timeDifference <= 5 && (
              <IconButton
                aria-label="Göster"
                icon={<FcCancel className="w-7 h-7 text-red-500" />}
                onClick={() => handleCancelMailRequest(row)}
              />
            )}
          </HStack>
        );
      },
      grow: "1",
    },
  ];

  const tableStyle = {
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: "bold",
        color: "white",
        backgroundColor: "#1C2541", // Pastel mavi tonuna karşılık gelen renk kodu
      },
    },
  };

  return (
    <>
      <Modal onClose={onClose} size={"5xl"} isOpen={isOpen}>
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader>{mailTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div dangerouslySetInnerHTML={{ __html: mailContent }} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={onClose}>
              Kapat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div
        style={{
          display: "flex",
          flexDirection: "column", // Dikey hizalama
          alignItems: "center", // Ortaya hizalama
          minHeight: "100vh",
        }}
      >
        <div className="flex flex-col items-center justify-center w-full h-20 text-3xl text-white bg-blue-500">
          <Navbar />
        </div>
        <div
          style={{
            flex: "1",
            width: "100%",
            maxHeight: "100vh", // İçeriğin maksimum yüksekliği
            overflowY: "auto", // Yalnızca dikey scrollbar görüntülenir
          }}
        >
          <DataTable
            highlightOnHover={true}
            customStyles={tableStyle}
            columns={columns}
            data={mailHistoryData}
            defaultSortFieldId={5}
            defaultSortAsc={false}
            noDataComponent={"Herhangi bir kayıt bulunamadı"}
          />
        </div>

        <footer
          className="flex flex-col items-center text-center text-white"
          style={{ backgroundColor: "#1C2541", width: "100%" }}
        >
          <div
            className="w-full p-4 text-center"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          >
            © 2023 Copyright:
            <a className="text-white" href="https://tailwind-elements.com/">
              K2M Bilisim Ltd Sti.
            </a>
          </div>
        </footer>
      </div>
    </>
  );
};

export default MailHistory;
