import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../context/ChatProvider";

const UserListItem = ({user, handleFunction,bg,color }) => {

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      _hover={{
        background: `${color?"white":"#ff33"}`,
        color: `${color?"black":"white"}`,
      }}
      w="100%"
      display="flex"
       color={color?"black":"white"}
      alignItems="center"
      border={"1px "}
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;