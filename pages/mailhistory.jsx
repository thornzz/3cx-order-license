import React from "react";
import { Container, Button, HStack } from "@chakra-ui/react";
import DataTable from "react-data-table-component";
import Navbar from "../components/Navbar";

const MailHistory = () => {
  const columns = [
    {
      name: "Mail Başlığı",
      selector: (row) => row.mail_title,
    },
    {
      name: "Mail İçeriği",
      selector: (row) => row.mail_content,
    },
    {
      name: "Tarih",
      selector: (row) => row.mail_datetime,
    },
    {
      name: "İşlemler",
      cell: (row) => (
        <HStack spacing="15px">
          <Button colorScheme="red">Tekrarla</Button>
          <Button colorScheme="blue">Detaylı Göster</Button>
        </HStack>
      ),
      grow: "0.8",
    },
  ];

  const data = [
    {
      id: 1,
      mail_title: "Deneme Maili",
      mail_content: "content 1",
      mail_datetime: "2021-09-27 15:00:00",
    },
    {
      id: 2,
      mail_title: "Deneme Maili 2",
      mail_content: "content 2",
      mail_datetime: "2021-09-27 15:00:00",
    },
    {
      id: 3,
      mail_title: "Deneme Maili 3",
      mail_content: "content 3",
      mail_datetime: "2021-09-27 15:00:00",
    },
    {
      id: 4,
      mail_title: "Deneme Maili 4",
      mail_content: "content 4",
      mail_datetime: "2021-09-27 15:00:00",
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
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <DataTable customStyles={tableStyle} columns={columns} data={data} />
      </div>
    </>
  );
};

export default MailHistory;
