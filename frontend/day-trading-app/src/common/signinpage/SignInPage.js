import { useState } from "react";
import { useContext } from "react";
import { Flex, Heading, Input, Button, InputGroup, Stack, InputLeftElement, chakra, Box, Link, Avatar, FormControl, FormHelperText, InputRightElement, Spinner, Center } from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";
import axios from "axios";


const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);
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
const SignInPage = (props) => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('testUser');

  const handleSubmit = async event => {
    event.preventDefault();
    window.username = username;
    const commandToSend = new Command(window.transactionNumber, username, 0, null, null);
    const url = "http://localhost:80/add";
    axios
        .post(url, commandToSend)
        .then((response) => {
        console.log(response.data);
        //res.status(200).json(response.data);
        })
        .catch((error) => {
        console.log("###error in CLI###");
        console.log(error);
    });
    props.onPageSwitch('mainpage')
  };

  const handleShowClick = () => setShowPassword(!showPassword);

  return (
    <Flex flexDirection="column" height="100%" width="100%" backgroundColor="gray.200" justifyContent="center" alignItems="center">
      <Stack flexDir="column" mb="2" justifyContent="center" alignItems="center">
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form onSubmit={handleSubmit}>
            { error }
            <Stack spacing={4} p="1rem" backgroundColor="whiteAlpha.900" boxShadow="md">
              <FormControl>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}/>
                  <Input type="email" placeholder="email address" onChange={event => setUsername(event.currentTarget.value)}/>
                </InputGroup>
              </FormControl>
              <FormControl>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" color="gray.300" children={<CFaLock color="gray.300" />}/>
                  <Input type={showPassword ? "text" : "password"} placeholder="Password" onChange={event => setPassword(event.currentTarget.value)}/>
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormHelperText textAlign="right">
                  <Link>forgot password?</Link>
                </FormHelperText>
              </FormControl>
              <Button onClick={handleSubmit}borderRadius={0} type="submit" variant="solid" colorScheme="teal" width="full">
                Login
              </Button>
              {loading && <Center><Spinner/></Center>}
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        <Link color="teal.500">
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};
export default SignInPage;