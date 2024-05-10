import { useEffect, useState} from "react"
import { useNavigate} from "react-router-dom";
import Login from "../components/authentication/Login";
import Register from "../components/authentication/Register";
import {
  Container,
  Box,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from "@chakra-ui/react";
function Home() {

   const navigate = useNavigate();
    useEffect(()=>{

    const userInfo =   JSON.parse(localStorage.getItem('userInfo'));

    if(userInfo){

        navigate('/chats')
    }

    },[navigate])

  return (
    <Container maxW="xl" centerContent>
      <Box
        display="flex"
        justifyContent="center"
        p={3}
        bg=""
        m="40px 0 40px 0"
        w="100%"
      >
       <Text fontFamily={'cursive'}  fontSize={'xx-large'} fontStyle={'oblique'}>ChatEase</Text>
      </Box>
      <Box bg=""  w="100%" p={4} borderRadius="lg" color="black" borderWidth="1px" borderColor={'black'}>
        <Tabs variant="soft-rounded" >
          <TabList>
            <Tab color={"white"} _selected={{bg:"transperent",border:"1px solid black"}} w="50%">Login</Tab>
            <Tab color={"white"} _selected={{bg:"transperent",border:"1px solid black"}}  w="50%">Register</Tab>
          </TabList>
          <TabPanels>
            <TabPanel><Login/></TabPanel>
            <TabPanel><Register/></TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
}

export default Home;
