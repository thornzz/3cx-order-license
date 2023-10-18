"use client";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  addDoc,
  collection,
  query,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/index";
import { TfiEmail } from "react-icons/tfi";
import { MdPersonSearch, MdPermContactCalendar } from "react-icons/md";
import { z } from "zod";

import {
  Input,
  IconButton,
  Spacer,
  HStack,
  Stack,
  Tag,
  TagCloseButton,
  TagLabel,
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
  FormControl,
  FormLabel,
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
import { data } from "autoprefixer";

const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const PartnersMailingList = ({ partnersFromAPI }) => {
  //getting searchParams
  const searchParams = useSearchParams();
  const mail_id = searchParams.get("mail_id");
  const [modalPartnerSearchText, setSearchText] = useState("");
  const [files, setFiles] = useState([]);
  const [partners, setPartners] = useState([]);
  const [additionalPartners, setAdditionalPartners] = useState([]);
  function isValidEmail(email) {
    // Basit bir e-posta doğrulama deseni
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }
  const initialFormData = {
    CompanyName: "",
    ContactName: "",
    ContactPhone: "",
    Email: "",
    PartnerLevelName: "Fanvil Partner",
  };
  const [formData, setFormData] = useState({
    CompanyName: "",
    ContactName: "",
    ContactPhone: "",
    Email: "",
    PartnerLevelName: "Fanvil Partner",
  });

  const handleAddPartnerChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleAddPartnerSave = async (e) => {
    try {
      if (formData.companyName === "") {
        toast.error("Lütfen firma adını boş bırakma", {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        return;
      }
      // Veritabanına kayıt ekleme işlemi
      await addDoc(collection(db, "additionalpartners"), { ...formData });
      // Başarılı mesajı göster
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
      // Formu temizle
      setFormData(initialFormData);
    } catch (error) {
      // Hata mesajını göster
      toast.error(error.message, {
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

  const handleFileRemove = (fileToRemove) => {
    // Dosya listesinde verilen dosyanın index'ini bulun
    const indexToRemove = files.findIndex(
      (file) => file.name === fileToRemove.name
    );

    if (indexToRemove !== -1) {
      // Dosya listesinden dosyayı kaldırma işlemi
      const updatedFiles = [...files];
      updatedFiles.splice(indexToRemove, 1);
      // Dosya listesini güncelle
      setFiles(updatedFiles);
    }
  };

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

  const getAdditionalPartners = async () => {
    const q = query(collection(db, "additionalpartners"));
    const unsubscribe = onSnapshot(q, async (querySnapshot) => {
      const arr = querySnapshot.docs.map((d) => ({
        PartnerId: d.id,
        ...d.data(),
      }));

      setAdditionalPartners([...arr]);
      setPartners((prev) => [...arr, ...partnersFromAPI]);
    });
  };

  useEffect(() => {
    (async () => {
      try {
        await getAdditionalPartners();
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

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
          type: resp.type,
          files: resp.data,
          error: resp.msg,
          msg: resp.msg,
        };
      },
      error(e) {
        this.j.e.fire("errorMessage", e.message, "error", 4000);
      },
      defaultHandlerSuccess(resp) {
        const j = this;
        if (resp.type === "Image") {
          const tagName = "img";
          const filename = resp.files[0];
          const elm = j.jodit.createInside.element(tagName);
          elm.setAttribute("src", filename);
          j.jodit.s.insertImage(elm, null, j.o.imageDefaultWidth);
        } else {
          const newFile = [resp.files];
          setFiles((prevFiles) => [...prevFiles, ...newFile]);
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

  const modalPartnerListcolumns = [
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
  const modalPartnerListDisclosure = useDisclosure();
  const modalAdditionalPartnerListDisclosure = useDisclosure();
  const popoverDisclosure = useDisclosure(); // Popover için useDisclosure hook'u

  const moment = require("moment");
  const currentDatetime = moment().format("DD.MM.YYYY HH:mm");
  const [selectedPartner, setSelectedPartner] = useState([]);

  const partnerLevels = [
    "Fanvil",
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

  const filteredPartners = partners?.filter((item) => {
    return ["CompanyName", "ContactName", "PartnerLevelName"]
      .map((field) => {
        const val = item[field];
        return val ? val.toLowerCase() : ""; // Convert to lowercase if not null, otherwise use an empty string
      })
      .some((val) => val.includes(modalPartnerSearchText.toLowerCase()));
  });

  const scheme = z
    .object({
      title: z.string().min(3,{message:"Konu başlığı için en az 3 karakter şartı var"}),
      content: z.string().min(3,{message:"İçerik için en az 3 karakter şartı var."}),
      selectedPartner: z.array(
        z.object({
          label: z.string(),
          value: z.string(),
        })
      ),
      optionalPartnerEmails: z.array(z.string().email()),
      DateTime: z.string(),
      files: z.array(z.string()),
    })
    .refine(
      (data) =>
        (data.selectedPartner.length !== 0 && data.optionalPartnerEmails.length === 0)  ||
        (data.selectedPartner.length === 0 && data.optionalPartnerEmails.length !== 0),
      () => ({
        message: `En az bir bayi seçilmeli veya e-posta adresi girilmelidir.`,
        path: ["selectedPartner", "optionalPartnerEmails"],
      })
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
        files: files,
      };

      const validate = scheme.safeParse(requestObj);
      console.log(validate)
      if(validate.success !== true) {
        toast.error(validate.error.errors[0].message, {
          position: "top-center",
          autoClose: 1500,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setLoading(false);
        return;
      }

      console.log('işlemler başlıyor')
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
        setFiles([]);
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
        onClose={modalPartnerListDisclosure.onClose}
        size={"5xl"}
        isOpen={modalPartnerListDisclosure.isOpen}
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
                columns={modalPartnerListcolumns}
                data={filteredPartners}
                noDataComponent={"Herhangi bir kayıt bulunamadı"}
                subHeader
                subHeaderComponent={
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <h3 style={{ margin: "0 10px" }}>Ara :</h3>
                    <input
                      type="text"
                      value={modalPartnerSearchText}
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
            <Button
              colorScheme="blue"
              onClick={modalPartnerListDisclosure.onClose}
            >
              Kapat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        onClose={modalAdditionalPartnerListDisclosure.onClose}
        size={"3xl"}
        isOpen={modalAdditionalPartnerListDisclosure.isOpen}
      >
        <ModalOverlay
          bg="none"
          backdropFilter="auto"
          backdropInvert="80%"
          backdropBlur="2px"
        />
        <ModalContent>
          <ModalHeader>Fanvil Bayi Kişi Ekle</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Firma Adı</FormLabel>
              <Input
                type="text"
                name="CompanyName"
                value={formData.CompanyName}
                onChange={handleAddPartnerChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Yetkili</FormLabel>
              <Input
                type="text"
                name="ContactName"
                value={formData.ContactName}
                onChange={handleAddPartnerChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Telefon Numarası</FormLabel>
              <Input
                type="number"
                name="ContactPhone"
                value={formData.ContactPhone}
                onChange={handleAddPartnerChange}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>E-mail</FormLabel>
              <Input
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleAddPartnerChange}
                onBlur={(e) => {
                  if (!isValidEmail(e.target.value)) {
                    alert("Geçerli bir e-posta adresi giriniz.");
                    e.target.value = "";
                  }
                }}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={2} onClick={handleAddPartnerSave}>
              Kaydet
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                setFormData(initialFormData);
              }}
            >
              Temizle
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
                  onClick={modalPartnerListDisclosure.onOpen}
                />
                <IconButton
                  colorScheme="blue"
                  aria-label="Bayi listesi"
                  icon={<MdPermContactCalendar />}
                  onClick={modalAdditionalPartnerListDisclosure.onOpen}
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
                    <Stack direction="row">
                      <Box>Dosya listesi:</Box>
                      {files.map((file, index) => {
                        if (file.type !== "Image") {
                          return (
                            <Tag
                              key={index}
                              borderRadius="full"
                              variant="solid"
                              colorScheme="red"
                            >
                              <TagLabel>{file.name}</TagLabel>
                              <TagCloseButton
                                onClick={() => {
                                  handleFileRemove(file);
                                }}
                              />
                            </Tag>
                          );
                        }
                        return null; // Eğer dosya türü 'Image' ise null döndür.
                      })}
                    </Stack>
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
  console.log(partners);

  return {
    props: { partnersFromAPI: partners },
  };
}
