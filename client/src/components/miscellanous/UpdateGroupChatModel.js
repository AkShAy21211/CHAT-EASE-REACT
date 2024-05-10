import React, { useState } from "react";
import {
  Modal,
  useDisclosure,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  IconButton,
  useToast,
  Box,
  FormControl,
  Input,
  Spinner,
} from "@chakra-ui/react";
import UserListItem from "../UserAvatar/UserListItem";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../context/ChatProvider";
import UserBadge from "../UserAvatar/UserBadge";
import axios from "axios";
function UpdateGroupChatModel({ fetchAgain, setFetchAgain,fetchMessages }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [seatchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);
  const toast = useToast();

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Please enter new name",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },

        config
      );
      console.log(data);
      setSelectedChat(data);
      setFetchAgain((prev) => !prev);
      setRenameLoading(false);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      setRenameLoading(false);
    }

    setGroupChatName("");
  };

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

  const handAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        title: `${userToAdd.name} is alreday in group`,
        status: "info",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },

        config
      );

      setSelectedChat(data);
      setLoading(false);
      setFetchAgain((prev) => !prev);
      toast({
        title: `${userToAdd.name} is successfully added`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (userToDelete) => {
    if (selectedChat.users.length <= 2) {
      toast({
        title: `Group shoud have atleast 2 menbers`,
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      return;
    }

    try {
      setLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/chat/removegroup",
        {
          chatId: selectedChat._id,
          userId: userToDelete._id,
        },

        config
      );

      setSelectedChat(data);
      setLoading(false);

      setFetchAgain((prev) => !prev);
      fetchMessages()
      toast({
        title: `${userToDelete.name} is successfully removed from the group`,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Error occured",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <IconButton
        onClick={onOpen}
        display={{ base: "flex" }}
        icon={<ViewIcon />}
      >
        Open
      </IconButton>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
        bg={'transparent'}
        color={'white'}
        border={'1px'}
         backdropFilter= "blur(5px)"
        
        >
          <ModalHeader
            fontSize={"35px"}
            fontFamily={"sans-serif"}
            display={"flex"}
            justifyContent={"center"}
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box w={"100%"} display={"flex"} flexWrap={"wrap"} pb={3}>
              {selectedChat.users?.map((user) => (
                <UserBadge
                  key={user._id}
                  user={user}
                  handleFunction={() => handleDelete(user)}
                />
              ))}
            </Box>
            <FormControl>
              <Input
                type="text"
                placeholder="Change Name"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                w={"100%"}
                value={"solid"}
                mb={5}
                colorScheme="teal"
                isLoading={renameLoading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl>
              <Input
                type="text"
                placeholder="Change Name"
                mb={3}
                onChange={(e) => handleSearch(e.target.value)}
              />
              {loading ? (
                <Spinner size={"lg"} />
              ) : (
                seatchResult?.map((user) => (
                  <UserListItem
                 
                    key={user._id}
                    user={user}
                    handleFunction={() => handAddUser(user)}
                  />
                ))
              )}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={() => handleDelete(user)} color={'red'} colorScheme="" border={'1px'} borderColor={'red'}>
              Leav Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default UpdateGroupChatModel;
