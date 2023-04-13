import {Stack, IconButton, FormLabel, Input, useDisclosure, Button } from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";

import {
    Box,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Checkbox, 
    CheckboxGroup,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay, 
  } from '@chakra-ui/react'

  const url = "http://localhost:80";

  class Command {
      transactionId;
      username;
      amount;
      stockSymbol;
      filename;

      constructor(transactionId, username, amount, stockSymbol, filename) {
          this.transactionId = transactionId;
          this.username = username;
          this.amount = amount;
          this.stockSymbol = stockSymbol;
          this.filename = filename;
      }
  }

  const BuyButton = (props) => {

    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
    const { isOpen: isCommitOpen, onOpen: onCommitOpen, onClose: onCommitClose } = useDisclosure();
    const [username, setUsername] = useState('');
    const [stockSymbol, setStockSymbol] = useState('');
    const [amount, setAmount] = useState(0);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertHeader, setAlertHeader] = useState('');

    const commitBuy = async event => {
      event.preventDefault();
      var floatAmount = parseFloat(amount);
      console.log("username: ", username);

      const commandToSend = new Command(window.transactionNumber, window.username, null, null, null);
      var functionURL = url + '/commitBuy';
      axios
          .post(functionURL, commandToSend)
          .then((response) => {
          console.log(response.data);
          setAlertMessage(response.data);
          })
          .catch((error) => {
          console.log("###error in CLI###");
          console.log(error);
          });
      window.transactionNumber = window.transactionNumber + 1;
      onCommitClose();
      onAlertOpen();
    };

    const handleBuy = async event => {
        event.preventDefault();
        var floatAmount = parseFloat(amount);
        console.log("username: ", username);
        console.log("stock symbol: ", stockSymbol);
        console.log("amount: ", floatAmount);

        const commandToSend = new Command(window.transactionNumber, window.username, floatAmount, stockSymbol, null);
        var functionURL = url + '/buy';
        axios
            .post(functionURL, commandToSend)
            .then((response) => {
            console.log(response.data);
            //res.status(200).json(response.data);
            setAlertMessage(response.data);
            var firstWord = response.data.replace(/ .*/,'');
            if(firstWord != 'Error:'){
              onCommitOpen();
            }else{
              onAlertOpen();
            }
            })
            .catch((error) => {
            console.log("###error in CLI###");
            console.log(error);
            setAlertHeader('Error');
            setAlertMessage(error);
            });
        window.transactionNumber = window.transactionNumber + 1;
        onModalClose();
    };
    const cancelBuy = async event => {
      event.preventDefault();
      var floatAmount = parseFloat(amount);
      console.log("username: ", username);

      const commandToSend = new Command(window.transactionNumber, window.username, null, null, null);
      var functionURL = url + '/cancelSell';
      axios
          .post(functionURL, commandToSend)
          .then((response) => {
          console.log(response.data);
          setAlertMessage(response.data);
          //res.status(200).json(response.data);
          })
          .catch((error) => {
          console.log("###error in CLI###");
          console.log(error);
          });
      window.transactionNumber = window.transactionNumber + 1;
      onCommitClose();
  };
    
    return (
      <Box>
        <Button colorScheme='blue' onClick={onModalOpen}>Buy</Button>
        <Modal isOpen={isModalOpen} onClose={onModalClose}>
          <ModalOverlay />
          <ModalContent>
          
            <ModalHeader>Buy Stock</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            
            {/* <FormLabel>User ID</FormLabel>
            <Input onChange={event => setUsername(event.currentTarget.value)}/> */}
            <FormLabel pt='3'>Stock Symbol</FormLabel>
            <Input onChange={event => setStockSymbol(event.currentTarget.value)}/>
            <FormLabel pt='3'>Amount</FormLabel>
            <Input onChange={event => setAmount(event.currentTarget.value)}/>
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={handleBuy}>
                Buy
              </Button>
              <Button variant='ghost' onClick={onModalClose}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <AlertDialog
        isOpen={isAlertOpen}
        onClose={onAlertClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            </AlertDialogHeader>

            <AlertDialogBody>
              {alertMessage}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={onAlertClose}>
                Ok
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog
        isOpen={isCommitOpen}
        onClose={onCommitClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Commit Buy
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to buy {stockSymbol}?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={cancelBuy}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={commitBuy} ml={3}>
                Buy
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      </Box>
    )
  }

  export default BuyButton;