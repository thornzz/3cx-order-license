import React, { useEffect, useState } from "react";
import { db } from "../firebase/index";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
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
  const moment = require("moment");
  const handleShowMailContent = (requestObject) => {
    setMailContent(requestObject.content);
    setMailTitle(requestObject.title);
    onOpen();
  };

  useEffect(() => {
    set_document(document);
  }, []);

  const sortDateTime = (rowA, rowB) => {
    let moment = require("moment");
    return (
      moment(rowA.requestObj.DateTime, "DD.MM.YYYY").unix() -
      moment(rowB.requestObj.DateTime, "DD.MM.YYYY").unix()
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
      cell: (row) => (
        <HStack spacing="15px">
          <Link
            href={{
              pathname: "/partnersmailinglist",
              query: {
                mail_id: row.id,
              },
            }}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          >
            Tekrarla
          </Link>

          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleShowMailContent(row.requestObj)}
          >
            Göster
          </button>
        </HStack>
      ),
      grow: "0.8",
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
      <Navbar />

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
        <div
          style={{
            flex: "1",
            width: "100%",
            maxHeight: "100vh", // İçeriğin maksimum yüksekliği
            overflowY: "auto", // Yalnızca dikey scrollbar görüntülenir
          }}
        >
          <DataTable
            customStyles={tableStyle}
            columns={columns}
            data={props.allMailHistoryData}
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

export async function getServerSideProps(context) {
  // Get Mail History Data

  const getMailHistory = async () => {
    const collectionRef = collection(db, "mailhistory");
    const q = query(collectionRef);
    const querySnapshot = await getDocs(q);
    const getMailHistoryData = querySnapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
    return getMailHistoryData;
  };
  const allMailHistoryData = await getMailHistory();

  return {
    props: { allMailHistoryData }, // will be passed to the page component as props
  };
}
