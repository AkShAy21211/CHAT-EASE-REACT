import React, { useState } from "react";
import {
  useDisclosure,
  Modal,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
  ModalBody,
  ModalHeader,
  Button,
  ModalContent,
  useToast,
  FormControl,
  Input,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { ChatState } from "../../context/ChatProvider";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadge from "../UserAvatar/UserBadge";
function GroupChatModel({ children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [seatchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/user?search=${query}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((user) => user._id)),
        },
        config
      );

      setChats([data, ...chats]);
      onClose();
      toast({
        title: `${groupChatName} has been created`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Something went wrong",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User Already Added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "yop",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  const handleDelete = (userToRemove) => {
    setSelectedUsers(
      selectedUsers.filter((user) => user._id !== userToRemove._id)
    );
  };
  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={'transparent'}
        color={'white'}
        border={'1px'}
         backdropFilter= "blur(5px)" p={2}>
          <ModalHeader
            fontSize={"25px"}
            fontFamily={"sans-serif"}
            display={"flex"}
            justifyContent={"center"}
          >
            Create Group Chats
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display={"flex"} flexDir={"column"} alignItems={"center"}>
            <FormControl>
              <Input
                type="text"
                placeholder="Chat Name"
                mb={3}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Add other users eg:arun"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            <Box display={"flex"} w={"100%"} flexWrap={"wrap"}>
              {selectedUsers?.map((user) => (
                <UserBadge
                
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
          </ModalBody>

          {loading ? (
            <Spinner m={8} display={"flex"} />
          ) : (
            seatchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  user={user}
                  key={user._id}
                  bg
                  
                  handleFunction={() => handleGroup(user)}
                ></UserListItem>
              ))
          )}

          <ModalFooter>
            <Button colorScheme="" border={'1px'} onClick={handleSubmit}>
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default GroupChatModel;
