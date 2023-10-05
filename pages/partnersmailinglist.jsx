import React, { useEffect, useState, useMemo, useRef } from "react";
import { TfiEmail } from "react-icons/tfi";
import {
  Input,
  SimpleGrid,
  VStack,
  StackDivider,
  Alert,
  AlertIcon,
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
} from "@chakra-ui/react";
import { MultiSelect } from "chakra-multiselect";
import Navbar from "../components/Navbar";
import Head from "next/head";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { debounce } from "lodash";
import { EmailChipInput } from "../utility/Components/EmailChipInput";
const JoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

const PartnersMailingList = (props) => {
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
          PARTNER_NAME: "#PARTNER_NAME#",
          CONTACT_NAME: "#CONTACT_NAME#",
        },
        childTemplate: (editor, key,value) => {
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

    // uploader: {
    //   insertImageAsBase64URI: true,
    // },
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

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onToggle, onClose } = useDisclosure();

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

  // const handleChange = (event) => {
  //   const { value } = event.target;
  //   setSelectedPartner(value);
  // };

  const [title, setTitle] = useState("");

  const handleTitleChange = debounce((value) => {
    setTitle(value);
  }, 3); // 3

  const [optionalPartnerEmails, setOptionalPartnerEmails] = useState([]);
  const [triggerEmailReset, setTriggerEmailReset] = useState(0);

  const submitHandler = async () => {
    try {
      setLoading(true);
      onToggle();
      var requestObj = {
        title: title,
        content: content,
        selectedPartner: selectedPartner,
        optionalPartnerEmails: optionalPartnerEmails,
      };
      const response = await fetch("/api/sendmail/partners/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestObj),
      });

      if (response.ok) {
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
        toast.error(errorData.error, {
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
      console.error(error);
      setLoading(false);

      toast.error("Bir hata oluştu, lütfen tekrar deneyin.", {
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
      <div>
        <Head>
          <title>Bayi İletişim</title>
          <meta name="description" content="3CX Order License" />
        </Head>
        <main>
          <Navbar />
          <div style={{ paddingTop: "50px" }}>
            <Flex justify="center" align="center" h="85vh">
              <Box
                bg="white" // Arka plan rengi
                p="6" // Padding
                borderRadius="md" // Köşe yuvarlama
                boxShadow="lg" // Gölge efekti
                width="70%" // Genişlik ayarı (örnek olarak %90)
                height="92h" // Yükseklik ayarı (örnek olarak 90vh)
              >
                <Flex justify="center" align="center" width="100%">
                  <Box width="95%" height="90%">
                    <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
                      Bayi İletişim Formu (Test)
                    </h1>
                    <Box className="flex justify-end">
                      <Popover
                        returnFocusOnClose={false}
                        isOpen={isOpen}
                        onClose={onClose}
                        placement="bottom"
                        closeOnBlur={false}
                      >
                        <PopoverTrigger>
                          <Button
                            isLoading={loading}
                            onClick={onToggle}
                            size="md"
                            colorScheme="twitter"
                            leftIcon={<TfiEmail />}
                            marginBottom={"5px"}
                          >
                            Gönderme işlemini başlat
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
                              <Button
                                colorScheme="green"
                                onClick={submitHandler}
                              >
                                Onayla
                              </Button>
                              <Button colorScheme="red" onClick={onToggle}>
                                İptal
                              </Button>
                            </ButtonGroup>
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                    </Box>
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
                        {/* {title === null || title === "" ? (
                          <div className="error" style={{ marginTop: "5px" }}>
                            <Alert status="error">
                              <AlertIcon />
                              Konu başlığı girilmeli
                            </Alert>
                          </div>
                        ) : null} */}
                      </Box>
                      <Box>
                        <EmailChipInput
                          setOptionalPartnerEmails={setOptionalPartnerEmails}
                          triggerEmailReset={triggerEmailReset}
                        />
                      </Box>
                    </form>
                    <JoditEditor
                      config={editorConfig}
                      ref={editor}
                      value={content}
                      tabIndex={1} // tabIndex of textarea
                      onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                      onChange={(newContent) => {}}
                    />
                  </Box>
                </Flex>
              </Box>
            </Flex>
          </div>
        </main>
      </div>
    </>
  );
};
export default PartnersMailingList;
