import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
function Login() {
  const [loginForm, setloginForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const onchange = (e) => {
    const { name, value } = e.target;

    setloginForm({ ...loginForm, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginForm;

    if (!email || !password) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post("/user/login", loginForm, config);

      toast({
        title: "Login successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      console.log(error.response);
      toast({
        title: "Login failed",
        status: "error",
        description: error.response.data.message,
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };


  return (
    <VStack spacing="5px" color="black">
      <FormControl isRequired>
        <FormLabel color={'white'}>Email</FormLabel>
        <Input
          borderColor={"white"}
          focusBorderColor="white"
          name="email"
          color={'white'}
          _placeholder={{ color: "white" }}
          defaultValue={loginForm.email}
          placeholder="Enter your email"
          type="string"
          onChange={onchange}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel color={'white'}>Password</FormLabel>
        <InputGroup>
          <Input
            borderColor={"white"}
            name="password"
                      color={'white'}

            _placeholder={{color: "white" }}
            defaultValue={loginForm.password}
            placeholder="Enter a password"
            focusBorderColor="white"
            type={show ? "string" : "password"}
            onChange={onchange}
          />
          <InputRightElement w="4.5rem">
            <Button
              size="sm"
              _hover={{ bg: "transparent" }}
              bg={"transparent"}
                            color={'white'}

              h="1.5rem"
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        w="100%"
        mt="5px"
        border={'1px'}
        borderColor={'blue'}
        bg={'transparent'}
        color={'white'}
        _hover={{bg:"transperent"}}
        _active={{bg:"transperent"}}
        isLoading={loading}
        onClick={handleSubmit}
      >
        Submit
      </Button>
      <Button
        w="100%"
        border={'1px'}
        bg={'transparent'}
         _hover={{bg:"transperent"}}
        _active={{bg:"transperent"}}
        color={'white'}
        borderColor={'yellow'}
        onClick={(e) =>
          setloginForm({ email: "guest@gmail.com", password: "guest123" })
        }
      >
        Login as guest
      </Button>
    </VStack>
  );
}

export default Login;
