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

    const AddButton = (props) => {
        const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
        const { isOpen: isAlertOpen, onOpen: onAlertOpen, onClose: onAlertClose } = useDisclosure();
        const { isOpen, onOpen, onClose } = useDisclosure()
        const [username, setUsername] = useState('');
        const [amount, setAmount] = useState(0);
        const [alertMessage, setAlertMessage] = useState('');
        const [alertHeader, setAlertHeader] = useState('');
        
        const handleAdd = async event => {
            event.preventDefault();
            var floatAmount = parseFloat(amount);
            console.log("username: ", username);
            console.log("amount: ", floatAmount);
            console.log("transactionid: ", window.transactionNumber);
            const commandToSend = new Command(window.transactionNumber, window.username, floatAmount, null, null);
            var functionURL = url + '/add';
            axios
                .post(functionURL, commandToSend)
                .then((response) => {
                console.log(response.data);
                //res.status(200).json(response.data);
                setAlertMessage(response.data)
                })
                .catch((error) => {
                console.log("###error in CLI###");
                console.log(error);
                });
            window.transactionNumber = window.transactionNumber + 1;
            onModalClose();
            onAlertOpen();
        };
        
        return (
        <Box>
            <Button colorScheme='blue' onClick={onModalOpen}>Add</Button>
            <Modal isOpen={isModalOpen} onClose={onModalClose}>
            <ModalOverlay />
            <ModalContent>
            
                <ModalHeader>Add Funds</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                
                {/* <FormLabel>User ID</FormLabel>
                <Input onChange={event => setUsername(event.currentTarget.value)}/> */}
                <FormLabel pt='3'>Amount</FormLabel>
                <Input onChange={event => setAmount(event.currentTarget.value)}/>
                </ModalBody>
    
                <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={handleAdd}>
                    Save
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
        </Box>
        )
  }

  export default AddButton;