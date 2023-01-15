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
import { AiOutlineUser } from "react-icons/ai";
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
    await router.push("/login");
    await signOut();
  };
  return (
    <>
      <Drawer
        isOpen={isOpen}
        placement="right"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Ayarlar</DrawerHeader>

          <DrawerBody>
            <VStack align={"flex-start"} spacing={5}>
              <Box ml={1}>
                <Link href={"/dashboard"}>
                  {" "}
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

              <Flex ml={1} alignItems="flex-start">
                <Badge w="4" variant="solid" colorScheme="red" mr={3} ml={2}>
                  {getCartLengthState}
                </Badge>
                <Link href={"/cart"}>
                  <Text fontSize="md" fontWeight="bold">
                    Sepet
                  </Text>
                </Link>
              </Flex>
            </VStack>
          </DrawerBody>

          <DrawerFooter>
            <Flex gap={2}>
              <Avatar bg="red.500" icon={<AiOutlineUser fontSize="1.2rem" />} />
              <Box w="150px" as={"span"}>
                {" "}
                {session?.user?.email}
              </Box>

              <Button p={3} colorScheme="blue" onClick={Logout}>
                Çıkış
              </Button>
            </Flex>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <nav className="flex items-center justify-between bg-gray-900 shadow shadow-xl">
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
