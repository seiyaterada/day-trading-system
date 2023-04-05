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
} from '@chakra-ui/react';
import StockList from '../stocklist/StockList';
import Wallet from '../wallet/Wallet';
import HomePage from '../mainpage/MainPage'


const CentralPage = (props) => {
    return (
      <ChakraProvider theme={theme}>
        <Box textAlign="center" fontSize="xl">
          <Tabs>
            <TabList>
              <Tab>Home</Tab>
              <Tab>Stocks</Tab>
              <Tab>Wallet</Tab>
              <Tab>My stocks</Tab>
              <Tab>Profile</Tab>
              <Tab>Transaction history</Tab>
            </TabList>
  
            <TabPanels>
            <TabPanel>
                <p>Home</p>
                <HomePage/>
              </TabPanel>
              <TabPanel>
                <p>Stocks</p>
                <StockList/>
              </TabPanel>
              <TabPanel>
                <p>Wallet</p>
                <Wallet/>
              </TabPanel>
              <TabPanel>
                <p>My stocks</p>
              </TabPanel>
              <TabPanel>
                <p>Profile</p>
              </TabPanel>
              <TabPanel>
                <p>Transaction history</p>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </ChakraProvider>
    );
  }
  
  export default CentralPage;