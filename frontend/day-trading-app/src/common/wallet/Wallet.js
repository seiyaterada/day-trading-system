import React from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Image,
  Badge,
  Flex,
  Spacer,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Stack,
  HStack,
  StackDivider,
  Heading,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Divider,
  Button, ButtonGroup
} from '@chakra-ui/react';
import { useContext, useState,  } from "react";
import * as ReactDOM from 'react-dom';
import { useEventListener } from '@chakra-ui/react';

const Balance = {
    
}



const Wallet = (props) => {
  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      align="stretch"
    >
      <Feature title="Account Balance" desc="$9999" />
      
    </VStack>
  );
};



function Feature({ title, desc, ...rest }) {
    const [amountToAdd, setAmount] = useState(0);

    const addFunds = async event => {
        event.preventDefault();
        console.log("amount to add: ", amountToAdd);

    };
    return (
      <Box p={5} shadow="md" borderWidth="1px" {...rest}>
        <Heading fontSize="xl" align="left">
          {title}
        </Heading>
        <Text mt={4} align="left" p={5}>
          {desc}
        </Text>
        <Divider/>
        <Text align="left" paddingTop={5}>
          Add funds
        </Text>
        
        <NumberInput maxW={200} onChange={event => setAmount(event)}>
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <Button onClick={addFunds}>
            Add
        </Button>
      </Box>
    );
  }
export default Wallet;
