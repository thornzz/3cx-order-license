"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo, useRef } from "react";
import { addDoc, collection, query, getDocs } from "firebase/firestore";
import { db } from "../firebase/index";
import { TfiEmail } from "react-icons/tfi";
import { MdPersonSearch } from "react-icons/md";
import {
  Input,
  IconButton,
  Spacer,
  HStack,
  Box,
  Flex,
  Button,
  ButtonGroup,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { MultiSelect } from "chakra-multiselect";
import Navbar from "../components/Navbar";
import Head from "next/head";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { debounce, get, set } from "lodash";
import { EmailChipInput } from "../utility/Components/EmailChipInput";
import DataTable from "react-data-table-component";
import { getPartners } from "./api/getpartners";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const PartnersMailingList = ({ partners }) => {
  //getting searchParams
  const searchParams = useSearchParams();
  const mail_id = searchParams.get("mail_id");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (!mail_id) return;
      const collectionRef = collection(db, "mailhistory");
      const q = query(collectionRef);
      const querySnapshot = await getDocs(q);
      const getMailHistoryData = querySnapshot.docs
        .map((d) => ({
          id: d.id,
          ...d.data(),
        }))
        .filter((item) => item.id === mail_id);
      setTitle(getMailHistoryData[0].requestObj.title);
      setContent(getMailHistoryData[0].requestObj.content);
      setSelectedPartner(getMailHistoryData[0].requestObj.selectedPartner);
      setOptionalPartnerEmails(
        getMailHistoryData[0].requestObj.optionalPartnerEmails
      );
    }

    fetchData();
  }, [mail_id]);

  const editor = useRef(null);
  const buttons = [
    "undo",
    "redo",
    "|",
    "bold",
    "underline",
    "italic",
    "|",
    "align",
    "|",
    "ul",
    "ol",
    "outdent",
    "indent",
    "|",
    "font",
    "fontsize",
    "brush",
    "paragraph",
    "|",
    "image",
    "link",
    "table",
    "|",
    "hr",
    "eraser",
    "copyformat",
    "|",
    "fullsize",
    "selectall",
    "|",
    "source",
    "|",
  ];
  const editorConfig = {
    readonly: false,
    toolbar: true,
    spellcheck: true,
    language: "tr",
    toolbarButtonSize: "medium",
    toolbarAdaptive: false,
    showCharsCounter: true,
    showWordsCounter: true,
    showXPathInStatusbar: false,
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    placeholder: "",
    //defaultActionOnPaste: "insert_clear_html",
    controls: {
      params: {
        name: "Parametreler",
        list: {
          FIRMA: "#PARTNER_NAME#",
          "YETKILI KISI": "#CONTACT_NAME#",
        },
        childTemplate: (editor, key, value) => {
          return `<span>${key}</span>`;
        },
        exec: function (editor, t, { control }) {
          if (!control || !control.args || control.args.length === 0) {
            console.error("control.args boş veya tanımsız.");
            return;
          }
          editor.selection.insertHTML(control.args[1]);
        },
      },
    },
    buttons: buttons,
    extraButtons: ["params"],

    uploader: {
      url: "/api/upload", //your upload api url
      insertImageAsBase64URI: false,
      imagesExtensions: ["jpg", "png", "jpeg", "gif"],
      //headers: {"token":`${db.token}`},
      filesVariableName: function (t) {
        return "files[" + t + "]";
      }, //"files",
      withCredentials: false,
      pathVariableName: "path",
      format: "json",
      method: "POST",
      prepareData: function (formdata) {
        return formdata;
      },
      isSuccess: function (e) {
        return e.success;
      },
      getMessage: function (e) {
        return void 0 !== e.data.messages && Array.isArray(e.data.messages)
          ? e.data.messages.join("")
          : "";
      },
      process: function (resp) {
        //success callback transfrom data to defaultHandlerSuccess use.it's up to you.
        let files = [];
        files.unshift(resp.data);
        return {
          files: resp.data,
          error: resp.msg,
          msg: resp.msg,
        };
      },
      error(e) {
        this.j.e.fire("errorMessage", e.message, "error", 4000);
      },
      defaultHandlerSuccess(resp) {
        // `this` is the editor.
        const j = this;
        if (resp.files && resp.files.length) {
          const tagName = "img";
          resp.files.forEach((filename, index) => {
            //edetor insertimg function
            const elm = j.createInside.element(tagName);
            elm.setAttribute("src", filename);
            j.s.insertImage(elm, null, j.o.imageDefaultWidth);
          });
        }
      },
      defaultHandlerError(e) {
        this.j.e.fire("errorMessage", e.message);
      },
      contentType: function (e) {
        return (
          (void 0 === this.jodit.ownerWindow.FormData ||
            "string" == typeof e) &&
          "application/x-www-form-urlencoded; charset=UTF-8"
        );
      },
    },

    width: "100%",
    height: 500,
  };

  const columns = [
    {
      name: "Bayi",
      selector: (row) => row.CompanyName,
    },
    {
      name: "Yetkili Kişi",
      selector: (row) => row.ContactName,
    },
    {
      name: "Telefon Numarası",
      selector: (row) => row.ContactPhone,
    },
    {
      name: "E-mail",
      selector: (row) => row.Email,
    },
    {
      name: "Partner Seviyesi",
      selector: (row) => row.PartnerLevelName,
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

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  //const { isOpen, onToggle, onClose } = useDisclosure();
  const modalDisclosure = useDisclosure(); // Modal için useDisclosure hook'u
  const popoverDisclosure = useDisclosure(); // Popover için useDisclosure hook'u

  const moment = require("moment");
  const currentDatetime = moment().format("DD.MM.YYYY HH:mm");
  const [selectedPartner, setSelectedPartner] = useState([]);

  const partnerLevels = [
    "Trainee",
    "Bronze",
    "Silver",
    "Gold",
    "Platinium",
    "Titanium",
  ];
  const optionsPartners = partnerLevels.map((label) => ({
    label,
    value: label.toLowerCase(),
  }));
  const [title, setTitle] = useState("");
  const handleTitleChange = debounce((value) => {
    setTitle(value);
  }, 3); // 3

  const [optionalPartnerEmails, setOptionalPartnerEmails] = useState([]);
  const [triggerEmailReset, setTriggerEmailReset] = useState(0);

  const filteredPartners = partners?.filter((item) =>
    [item.CompanyName, item.ContactName, item.PartnerLevelName]
      .map((val) => val.toLowerCase())
      .some((val) => val.includes(searchText.toLowerCase()))
  );

  const submitHandler = async () => {
    try {
      setLoading(true);
      popoverDisclosure.onToggle();
      var requestObj = {
        title: title,
        content: content,
        selectedPartner: selectedPartner,
        optionalPartnerEmails: optionalPartnerEmails,
        DateTime: currentDatetime,
      };
      const response = await fetch("/api/sendmail/partners/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestObj),
      });

      if (response.ok) {
        //request objesini mail history collection'ına kaydet

        await addDoc(collection(db, "mailhistory"), { requestObj });

        // İstek başarıyla tamamlandı, beklemek gerekmiyor
        setLoading(false);
        setContent("");
        handleTitleChange("");
        setSelectedPartner([]);
        setOptionalPartnerEmails([]);
        setTriggerEmailReset(triggerEmailReset + 1);

        toast.success("İşlem başarıyla tamamlandı", {
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
        setLoading(false);

        // İstek başarısız oldu, hata mesajını kullanıcıya göster
        const errorData = await response.json();
        const errorString = JSON.stringify(errorData); // Convert errorData to a string

        toast.error(errorString, {
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
    } catch (error) {
      setLoading(false);

      toast.error(error, {
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

  return (
    <>
      <Modal
        onClose={modalDisclosure.onClose}
        size={"5xl"}
        isOpen={modalDisclosure.isOpen}
      >
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader>Bayi Listesi</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div
              style={{
                flex: "1",
                width: "100%",
                maxHeight: "50vh", // İçeriğin maksimum yüksekliği
                overflowY: "auto", // Yalnızca dikey scrollbar görüntülenir
              }}
            >
              <DataTable
                customStyles={tableStyle}
                columns={columns}
                data={filteredPartners}
                noDataComponent={"Herhangi bir kayıt bulunamadı"}
                subHeader
                subHeaderComponent={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h3 style={{ margin: "0 10px" }}>Ara :</h3>
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      style={{
                        border: "none",
                        borderBottom: "1px solid black",
                      }}
                    />
                  </div>
                }
              />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={modalDisclosure.onClose}>
              Kapat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <div>
        <Head>
          <title>Bayi İletişim</title>
          <meta name="description" content="3CX Order License" />
        </Head>
        <main>
          <div
            style={{
              display: "flex",
              flexDirection: "column", // Dikey hizalama
              alignItems: "center", // Ortaya hizalama
              minHeight: "100vh",
            }}
          >
            <Navbar />

            <Box
              bg="white" // Arka plan rengi
              p="4" // Padding
              borderRadius="md" // Köşe yuvarlama
              boxShadow="lg" // Gölge efekti
              height="100h"
              mt="5" // Yükseklik ayarı (örnek olarak 90vh)
            >
              <HStack spacing="24px">
                <IconButton
                  colorScheme="red"
                  aria-label="Bayi listesi"
                  icon={<MdPersonSearch />}
                  onClick={modalDisclosure.onOpen}
                />
                <Spacer />
                <Box>
                  <Popover
                    returnFocusOnClose={false}
                    isOpen={popoverDisclosure.isOpen}
                    onClose={popoverDisclosure.onClose}
                    placement="bottom"
                    closeOnBlur={false}
                  >
                    <PopoverTrigger>
                      <Button
                        isLoading={loading}
                        onClick={popoverDisclosure.onToggle}
                        size="md"
                        colorScheme="twitter"
                        leftIcon={<TfiEmail />}
                        marginBottom={"5px"}
                      >
                        Gönder
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      color="white"
                      bg="blue.800"
                      borderColor="blue.800"
                    >
                      <PopoverHeader pt={4} fontWeight="bold" border="0">
                        İşlem onayı
                      </PopoverHeader>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        Gönderme işlemine devam edilsin mi?
                      </PopoverBody>
                      <PopoverFooter
                        border="0"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                        pb={4}
                      >
                        <ButtonGroup size="sm">
                          <Button colorScheme="green" onClick={submitHandler}>
                            Onayla
                          </Button>
                          <Button
                            colorScheme="red"
                            onClick={popoverDisclosure.onToggle}
                          >
                            İptal
                          </Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                </Box>
              </HStack>
              <Flex justify="center" align="center" width="100%">
                <Box width="100%" height="90%">
                  <form>
                    <Box mt="2">
                      <MultiSelect
                        options={optionsPartners}
                        value={selectedPartner}
                        label="Bayi seviyesini seçiniz..."
                        onChange={setSelectedPartner}
                      />
                    </Box>

                    <Box mt="2" mb="2">
                      <Input
                        type="text"
                        name="title"
                        placeholder="Konu başlığı..."
                        onChange={(e) => {
                          handleTitleChange(e.target.value);
                        }}
                        value={title}
                      />
                    </Box>
                    <Box>
                      <EmailChipInput
                        setOptionalPartnerEmails={setOptionalPartnerEmails}
                        triggerEmailReset={triggerEmailReset}
                        triggerEmailAdd={optionalPartnerEmails}
                      />
                    </Box>
                  </form>
                  <JoditEditor
                    config={editorConfig}
                    ref={editor}
                    value={content}
                    tabIndex={1}
                    onBlur={(newContent) => setContent(newContent)}
                    onChange={(newContent) => {}}
                  />
                </Box>
              </Flex>
            </Box>
          </div>
        </main>
      </div>
    </>
  );
};
export default PartnersMailingList;

export async function getServerSideProps(context) {
  // Get Partners
  const partners = await getPartners();

  return {
    props: { partners },
  };
}
