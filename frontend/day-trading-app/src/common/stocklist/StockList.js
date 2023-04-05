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

} from '@chakra-ui/react';

function StockObject({ title, desc, ...rest }) {
  return (
    <Box p={5} shadow='md' borderWidth='1px' {...rest}>
      <Heading fontSize='xl' align="left">{title}</Heading>
      <Text mt={4} align="left">{desc}</Text>
    </Box>
  )
}

const Stock = {
  "stock1": "stock1 info",
  "stock2": "stock2 info",
  "stock3": "stock3 info",
  "stock4": "stock4 info",
  "stock5": "stock5 info", 
  "stock6": "stock6 info"
}


const StockList = props => {
  return (
    <VStack
      divider={<StackDivider borderColor="gray.200" />}
      spacing={4}
      align="stretch"
    >
      {Object.entries(Stock).map(
        ([key, value]) => {return(<StockObject title={key} desc = {value}/>)}
      )}
    
    </VStack>
  );
};
export default StockList;
