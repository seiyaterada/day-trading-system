import { useState } from "react";
import {
  Box,
  Grid,
  Button,
  ButtonGroup,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import BuyButton from "./buttons/BuyButton";
import StockList from "../stocklist/StockList";
import AddButton from "./buttons/AddButton";
import SellButton from "./buttons/SellButton";
import CommitBuy from "./buttons/CommitBuy";
import CommitSell from "./buttons/CommitSell";

const MainPage = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  window.transactionNumber = 1;
  return (
    <Box>
      <Grid templateColumns="repeat(3, 1fr)" gap={6}>
        <AddButton/>
        <BuyButton/>
        <SellButton/>
      </Grid>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modal Title</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>Input Field</FormLabel>
              <Input placeholder="Enter text here" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant="ghost">Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
export default MainPage;