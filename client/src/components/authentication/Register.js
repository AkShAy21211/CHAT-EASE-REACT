import React, { useState } from "react";
import {
  border,
  Button,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Register() {
  const [registerform, setRegisterForm] = useState({
    email: "",
    name: "",
    confirmpassword: "",
    password: "",
    picture: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const onchange = (e) => {
    const { name, value } = e.target;

    console.log(e);
    setRegisterForm({
      ...registerform,
      [name]: name === "picture" ? e.target.files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmpassword } = registerform;
    setLoading(true);

    if (!name || !email || !password || !confirmpassword) {
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

    if (!name || !email || !password || !confirmpassword) {
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

      const { data } = await axios.post("/user/register", registerform, config);
      toast({
        title: "Registration successfull",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        title: "Error occured",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
    }
  };

  const postDetails = (picture) => {
    setLoading(true);

    if (picture === undefined) {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (picture.type === "image/jpeg" || picture.type === "image/png") {
      const data = new FormData();
      data.append("file", picture);
      data.append("upload_preset", "CHAT-EASE");
      data.append("cloud_name", "dw4gp3hud");
      fetch(`https://api.cloudinary.com/v1_1/dw4gp3hud/image/upload`, {
        method: "POST",
        body: data,
      }).then((res) => {
        res
          .json()
          .then((data) => {
            console.log(data);
            setRegisterForm({ ...registerform, picture: data.url.toString() });
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      });
    } else {
      toast({
        title: "Please select an image",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <VStack spacing="5px" color="black">
      <FormControl>
        <FormLabel>Profile</FormLabel>
        <Input
          borderColor={"black"}
          color="white"
          name="picture"
          type="file"
          focusBorderColor="black" // This will remove the blue border on click
          size="sm"
          border={'1px'}
          _hover={{border:"1px"}}
          p="1px"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Name</FormLabel>
        <Input
                  color={'white'}

          _placeholder={{ color: "white" }}
          focusBorderColor="white" // This will remove the blue border on click
          borderColor={"white"}
          _hover={{border:"1px",borderColor:"white"}}
          name="name"
          placeholder="Enter your name"
          type="string"
          onChange={onchange}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Email</FormLabel>
        <Input
                  color={'white'}

          _placeholder={{ color: "white" }}
          focusBorderColor="white" // This will remove the blue border on click
          name="email"
           borderColor={"white"}
          _hover={{border:"1px",borderColor:"white"}}
          placeholder="Enter your email"
          type="string"
          onChange={onchange}
        />
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup>
          <Input
                    color={'white'}

            _placeholder={{ color: "white" }}
            focusBorderColor="white" // This will remove the blue border on click
            name="password"
             borderColor={"white"}
          _hover={{border:"1px",borderColor:"white"}}
 
            placeholder="Enter a password"
            type={show ? "string" : "password"}
            onChange={onchange}
          />
          <InputRightElement w="4.5rem">
            <Button
              size="sm"
              h="1.5rem"
              _hover={{ bg: "transparent" }}
              bg={"transparent"}
              onClick={() => setShow((prev) => !prev)}
            >
              {show ? "Hide" : "show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup>
          <Input
                    color={'white'}

            _placeholder={{ color: "white" }}
            focusBorderColor="white" // This will remove the blue border on click
            name="confirmpassword"
             borderColor={"white"}
          _hover={{border:"1px",borderColor:"white"}}
            placeholder="Confirm password"
            type={show ? "string" : "password"}
            onChange={onchange}
          />
          <InputRightElement w="4.5rem">
            <Button
              bg={"transparent"}
              _hover={{ bg: "transparent" }}
              size="sm"
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
                 _hover={{bg:"transperent"}}

        color={'white'}
        _active={{bg:"transparent"}}
        isLoading={loading}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </VStack>
  );
}

export default Register;
