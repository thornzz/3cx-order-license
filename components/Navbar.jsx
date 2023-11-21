import React, { useState, useEffect } from "react";
import Image from "next/image";
import ShoppingCart from "./ShoppingCart";
import { cart } from "../atoms/shoppingCartAtom";
import { useRecoilState } from "recoil";
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Dropdown } from "flowbite-react";
import { HiLogout, HiOutlineDocumentReport, HiViewGrid } from "react-icons/hi";
import { FiMail } from "react-icons/fi";
import { AiOutlineUser, AiOutlineHistory } from "react-icons/ai";
import { RxHamburgerMenu } from "react-icons/rx";
import { cartLength } from "../atoms/shoppingCartAtom";
import { useRecoilValue } from "recoil";
import {
  Drawer,
  IconButton,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Input,
  Button,
  Icon,
  VStack,
  Box,
  Text,
  Flex,
  Center,
  Badge,
  Avatar,
  HStack,
  Spacer,
} from "@chakra-ui/react";


function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = React.useRef();
  const cartLengthState = useRecoilValue(cartLength);
  const [getCartLengthState, setCartLengthState] = useState(null);

  useEffect(() => {
    setCartLengthState(cartLengthState);
  }, [cartLengthState]);

  const [resetCartState, setResetCartState] = useRecoilState(cart);
  const router = useRouter();
  const { data: session } = useSession();
  const Logout = async () => {
    await signOut();
    await router.push("/login");
  };
  return (
    <>

      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
        size="xs"
        m="0"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Ayarlar</DrawerHeader>

          <DrawerBody>
            <VStack align={"flex-start"} spacing={5}>
              <Box ml={1}>
                <Link href={"/dashboard"}>
                  <Icon as={HiViewGrid} w="7" h="8" /> Dashboard
                </Link>
              </Box>
              <Box ml={1}>
                <Link href={"/expiringkeys"}>
                  {" "}
                  <Icon as={HiOutlineDocumentReport} w="7" h="7" /> Expiring
                  Keys
                </Link>
              </Box>
              <Box ml={1}>
                <Link href={"/partnersmailinglist"}>

                  <Icon as={FiMail} w="7" h="7" /> Mail Formu
                </Link>
              </Box>
              <Box ml={1}>
                <Link href={"/mailhistory"}>

                  <Icon as={AiOutlineHistory} w="7" h="7" /> Mail Geçmişi
                </Link>
              </Box>
              <Flex ml={1} alignItems="flex-start">
                {/* <Badge w="4" variant="solid" colorScheme="red" mr={3} ml={2}>
                  {getCartLengthState}
                </Badge> */}
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-500 text-gray-50 mr-2">
                  {getCartLengthState}
                </span>
                <Link href={"/cart"}>
                  <Text fontSize="md" fontWeight="bold">
                    Sepet
                  </Text>
                </Link>
              </Flex>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Box className="flex flex-auto items-center justify-items-stretch">
              <Avatar
                mr={1}
                size="sm"
                bg="red.500"
                icon={<AiOutlineUser fontSize="1.2rem" />}
              />
              <Text mr="1">{session?.user?.email}</Text>
            </Box>
            <Button colorScheme="blue" onClick={Logout}>
              Çıkış
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <nav className="flex items-center justify-between bg-gray-900 shadow shadow-xl w-full">
        <div className="flex items-center flex-shrink-0 text-white mr-6 mt-2">
          <Image
            src="/logo.png"
            alt="K2M Bilişim Logo"
            width={140}
            height={90}
            className="mt-2 hover:cursor-pointer"
            onClick={() => router.push("/dashboard")}
          ></Image>
          <span className="font-semibold text-xl tracking-tight">
            <Link href="/dashboard">Lisans Portal </Link>
          </span>
        </div>

        <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto mt-2">
          <div className="text-md lg:flex-grow">
            <a
              href="#responsive-header"
              className="block mt-4 lg:inline-block lg:mt-0 text-gray-400 hover:text-white mr-2"
            ></a>
          </div>
          <IconButton
            variant="solid"
            colorScheme="blue"
            aria-label="Call Sage"
            fontSize="20px"
            mr={2}
            onClick={onOpen}
            icon={<RxHamburgerMenu />}
          />
        </div>
      </nav>

    </>
  );
}

export default Navbar;
