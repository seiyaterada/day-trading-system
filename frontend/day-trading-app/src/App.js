import React, {useState} from 'react';
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
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Logo } from './Logo';
import MainPage from './common/centralpage/CentralPage';
import SignInPage from './common/signinpage/SignInPage';
import { BrowserRouter, Route, Routes, Switch } from "react-router-dom";


function App() {
  const [currentPage, setPage] = useState('login');
  const togglePage = (pageName) => {
    setPage(pageName);
  }
  return (
    currentPage === 'login' ? <SignInPage onPageSwitch={togglePage}/> : <MainPage />
  );
}

export default App;
