import React, { useEffect, useState, useMemo, useRef } from "react";
import { TfiEmail } from "react-icons/tfi";
import {
  Input,
  Form,
  Select,
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
import Navbar from "../components/Navbar";
import Head from "next/head";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";
import dynamic from "next/dynamic";

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
    //defaultActionOnPaste: "insert_clear_html",
    buttons: buttons,
    // uploader: {
    //   insertImageAsBase64URI: true,
    // },
    uploader: {
      url: '/api/upload',  //your upload api url
      insertImageAsBase64URI: false, 
      imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
      //headers: {"token":`${db.token}`},
      filesVariableName: function (t) {
        return 'files[' + t + ']';
      }, //"files",
      withCredentials: false,
      pathVariableName: 'path',
      format: 'json',
      method: 'POST',
      prepareData: function (formdata) {
        return formdata;
      },
      isSuccess: function (e) {
        console.log(e)
        return e.success
      },
      getMessage: function (e) {
        return void 0 !== e.data.messages && Array.isArray(e.data.messages)
          ? e.data.messages.join('')
          : '';
      },
      process: function (resp) {
        console.log('resp',resp) //success callback transfrom data to defaultHandlerSuccess use.it's up to you.
        let files = [];
        files.unshift(resp.data);
        return {
          files: resp.data,
          error: resp.msg,
          msg: resp.msg,
        };
      },
      error(e) { 
        this.j.e.fire('errorMessage', e.message, 'error', 4000);
      },
      defaultHandlerSuccess(resp) { // `this` is the editor.
        const j = this;
        
        if (resp.files && resp.files.length) {
          const tagName = 'img';
          resp.files.forEach((filename, index) => { //edetor insertimg function
            const elm = j.createInside.element(tagName);
            elm.setAttribute('src', filename);
            j.s.insertImage(elm, null, j.o.imageDefaultWidth);
          });
        }
      },
      defaultHandlerError(e) {
        this.j.e.fire('errorMessage', e.message);
      },
      contentType: function (e) {
        return (
          (void 0 === this.jodit.ownerWindow.FormData || 'string' == typeof e) &&
          'application/x-www-form-urlencoded; charset=UTF-8'
        );
      },
    },
   
    width: "100%",
    height: 600,
  };

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { isOpen, onToggle, onClose } = useDisclosure();

  const [selectedPartner, setSelectedPartner] = useState("");

  const handleChange = (event) => {
    const { value } = event.target;
    setSelectedPartner(value);
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Konu başlığı girilmeli"),
  });

  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (formik.isValid) {
          setLoading(true);
          onToggle();
          var requestObj = {
            title: values.title,
            content: content,
            selectedPartner: selectedPartner,
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
            formik.resetForm();
            setLoading(false);
            setContent("");
            setSelectedPartner("");
            toast.success("İşlem başarıyla tamamlandı", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          } else {
            setLoading(false);
            setContent("");
            setSelectedPartner("");
            // İstek başarısız oldu, hata mesajını kullanıcıya göster
            const errorData = await response.json();
            toast.error(errorData.error, {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          }
        }
      } catch (error) {
        console.error(error);
        toast.error("Bir hata oluştu, lütfen tekrar deneyin.", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      }
    },
  });

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
            <Flex justify="center" align="center" h="87vh">
              <Box
                bg="white" // Arka plan rengi
                p="6" // Padding
                borderRadius="md" // Köşe yuvarlama
                boxShadow="lg" // Gölge efekti
                width="70%" // Genişlik ayarı (örnek olarak %90)
                height="800px" // Yükseklik ayarı (örnek olarak 90vh)
              >
                <Flex justify="center" align="center" width="100%">
                  <Box width="95%" height="90%">
                    <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
                      Bayi İletişim Formu (Test MODE)
                    </h1>

                    <form>
                      <Flex align="center" justify="center" width="100%">
                        <Box flex="1" mr="2">
                          <Input
                            type="text"
                            name="title"
                            placeholder="Konu başlığı..."
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                            required
                          />
                          {formik.touched.title && formik.errors.title ? (
                            <div className="error" style={{ marginTop: "5px" }}>
                              <Alert status="error">
                                <AlertIcon />
                                {formik.errors.title}
                              </Alert>
                            </div>
                          ) : null}
                        </Box>
                        <Box flex="1" mr="2">
                          <Select
                            placeholder="Bayi Seviyesini Seçiniz..."
                            size="md"
                            onChange={handleChange}
                            value={selectedPartner}
                          >
                            <option value="Trainee">Trainee</option>
                            <option value="Bronze">Bronze</option>
                            <option value="Silver">Silver</option>
                            <option value="Gold">Gold</option>
                            <option value="Platinium">Platinium</option>
                            <option value="Titanium">Titanium</option>
                          </Select>
                        </Box>

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
                              Email Gönder
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
                                  onClick={formik.handleSubmit}
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
                      </Flex>
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
