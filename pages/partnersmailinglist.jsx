import React, { Fragment, useEffect, useState } from "react";
import { GrLicense } from "react-icons/gr";
import { BiPaste } from "react-icons/bi";
import { TbLicense } from "react-icons/tb";
import { TfiEmail } from "react-icons/tfi";
import {
  Input,
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
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import Head from "next/head";
import { toast } from "react-toastify";

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
  ssr: false,
  loading: () => <p>Editör yükleniyor ...</p>,
});
const modules = {
  toolbar: [
    [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
    [{ size: [] }],
    ["bold", "italic", "underline", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    [{ align: [] }],
    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  
  ],
  clipboard: {
    // toggle to add extralökkğiş line breaks when pasting HTML:
    matchVisual: false,
  },
};
const PartnersMailingList = (props) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [address, setAddress] = useState("");
  const { isOpen, onToggle, onClose } = useDisclosure();

  function submitHandler(event) {
    event.preventDefault();

    // popover kapat
    onToggle();

    var requestObj = {
      title: title,
      content: content,
      address: address,
    };

    fetch("/api/sendmail/partners/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestObj),
    }).then((data) => console.log(data));
    setContent("");
    setTitle("");
    setAddress("");
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
  }

  return (
    <>
      <div>
        <Head>
          <title>Lisans Portal || Partner Mailing</title>
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
                  <Box width="90%">
                    <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>
                      Tüm Partnerlere eMail Gönder (Test MODE)
                    </h1>

                    <form onSubmit={submitHandler}>
                      <Flex align="center" justify="center" width="100%">
                        <Input
                          type="text"
                          value={title}
                          name="title"
                          placeholder="Konu başlığı..."
                          onChange={(e) => setTitle(e.target.value)}
                          required
                          flex="1"
                          mr="2"
                        />
                        <Input
                          type="text"
                          value={address}
                          name="address"
                          placeholder="Email gönderilecek adres..."
                          onChange={(e) => setAddress(e.target.value)}
                          required
                          flex="1"
                          mr="2"
                        />
                        <Popover
                          returnFocusOnClose={false}
                          isOpen={isOpen}
                          onClose={onClose}
                          placement="bottom"
                          closeOnBlur={false}
                        >
                          <PopoverTrigger>
                            <Button
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
                      </Flex>
                      <QuillNoSSRWrapper
                        modules={modules}
                        onChange={setContent}
                        value={content}
                        theme="snow"
                        style={{ height: "500px" }}
                        spellcheck="false"
                        placeholder={"E-mail içeriği..."}
                      />
                    </form>
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
