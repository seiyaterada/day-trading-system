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
import { BrowserRouter, Switch } from "react-router-dom";

import BuyButton from "./buttons/BuyButton";
import StockList from "../stocklist/StockList";
import AddButton from "./buttons/AddButton";
import SellButton from "./buttons/SellButton";

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
    </Box>
  );
}
export default MainPage;