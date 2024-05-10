import {
  useToast,
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  CloseButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  Spinner,
} from "@chakra-ui/react";
import {Effect} from "react-notification-badge"
import NotificationBadge from "react-notification-badge/lib/components/NotificationBadge"
import React, { useRef, useState } from "react";
import axios from "axios";
import { ChatState } from "../../context/ChatProvider";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import ProfileModel from "./ProfileModel";
import { useDisclosure } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import ChatLoading from "../ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { getSender } from "../../config/ChatLogics";
export default function SideDrawer() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [seatchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  const { user, setUser, selectedChat, setSelectedChat, chats, setChats,notification,setNOtifications } =
    ChatState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please enter someting",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });

      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "failed to lad the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/chat", { userId }, config);

      if(chats.find((c)=>c._id === data._id)) setChats([data,...chats])
      setLoadingChat(false);
      setSelectedChat(data);
      console.log(selectedChat);
      onClose()

    } catch (error) {
      if(error.response){
        toast({
        title: "Error fetching chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      }
      
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="black"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth={"2px"}
      >
        <Tooltip label="search users to chat" hasArrow placement="bottom-end">
          <Button color={"white"} variant="" onClick={onOpen}>
            <i class="fa-solid fa-magnifying-glass"></i>
            <Text
              color={"white"}
              display={{ base: "none", md: "flex" }}
              px="6px"
            >
              Search users
            </Text>
          </Button>
        </Tooltip>
        <Text color={"white"}>CHAT-EASE</Text>
        <div>
          <Menu>
            <MenuButton p={1}>
               <NotificationBadge
              count={notification.length}
              effect={Effect.SCALE}

              />
              <BellIcon color={"gold"} fontSize={"2xl"} m={1} />
              
            </MenuButton>
            <MenuList bg={'transparent'} color={'white'}     mt={'4'}  backdropFilter="blur(5px)" p={4}>
             
              {
                !notification.length&& "no new messages"
              }
              {
                notification.map((notify)=>(
                  
                  <MenuItem bg={'transparent'}  key={notify._id} onClick={()=>{
                    setSelectedChat(notify.chat)
                    setNOtifications(notification.filter((n)=> n!== notify))

                  }}>
                    {
                      notify.chat.isGroupChat?`New Message in ${notify.chat.chatName}`:`New Message from ${getSender(user,notify.chat.users)}`
                    }
                  </MenuItem>
                ))
              }
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton
              bg={"transparent"}
              _hover={{ bg: "transperent" }}
              _active={{ bg: "transperent" }}
              as={Button}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.picture}
              />
            </MenuButton>
            <MenuList bg={"black"}>
              <ProfileModel user={user}>
                <MenuItem bg={"black"} color={"white"}>
                  My Profile
                </MenuItem>
              </ProfileModel>
              <MenuDivider />
              <MenuItem bg={"black"} color={"white"} onClick={logoutHandler}>
                Logout
              </MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onclose} isOpen={isOpen} closeOnEsc>
        <DrawerOverlay />
        <DrawerContent
          style={{
            background: "transparent",
            boxShadow:"1px 6px 5px gray",
            color: "white",
            backdropFilter: "blur(5px)",
          }}
        >
          <DrawerHeader
            bg={""}
            display={"flex"}
            color={'re'}
            justifyContent={"end"}
            borderBottomWidth="px"
          >
            <CloseButton onClick={onClose} />
          </DrawerHeader>
          <DrawerBody bg={""}>
            <Box display="flex" pb="2">
              <Input
                placeholder="Search users"
                mr="2"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              seatchResult?.map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                ></UserListItem>
              ))
            )}
            {
              loadingChat && <Spinner variant={'white'} ml="auto" display="flex"/>
            }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
