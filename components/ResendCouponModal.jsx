import {
    HStack,
    Center,
    Portal,
    FormControl,
    FormLabel,
    Input,
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    Stack,
    ButtonGroup,
    Button,
    IconButton,
    useDisclosure,
    Checkbox,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
    ModalHeader,
    ModalCloseButton,
    Text,
    
  } from "@chakra-ui/react";
import { ImQrcode } from "react-icons/im";

const ResendCouponModal = ({ isResendCouponModalOpen,
    onisResendCouponModalOpen,
    onisResendCouponModalClose,}) => {

  return (
    <div>
     

      <HStack>
        <ImQrcode />
        <Text>Promosyon Kodu</Text>
      </HStack>

      <Stack ml={3}>
        <Checkbox colorScheme="red" size="md" onChange={handleCheckbox}>
          Alternatif email ekle
        </Checkbox>
        {true && (
          <Input
            type="email"
            placeholder="birisi@example.com"
            onChange={handleInputText}
          />
        )}
      </Stack>
    </div>
  );
};
export default ResendCouponModal;
