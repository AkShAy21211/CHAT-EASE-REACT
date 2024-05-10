import React from 'react'
import {IconButton, useDisclosure,Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  ModalCloseButton,
  Image,
  Text,} from "@chakra-ui/react"
import { ViewIcon } from '@chakra-ui/icons'
function ProfileModel({user,children}) {

    const {isOpen,onOpen,onClose} = useDisclosure()
  return (
    <>
     {
        children?<span onClick={onOpen}>{children}</span>:(
            <IconButton
            display={{base:"flex"}}
            icon={<ViewIcon/>}
            onClick={onOpen}
            />
         
        )
     }
      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{user.name}</ModalHeader>
          <ModalCloseButton />
    
          <ModalBody 
          display="flex"
          flexDir="column"
          alignItems="center"
          justifyContent={"space-between"}
          >
            <Image
            borderRadius="full"
            boxSize="150px"
            src={user.picture}
            alt={user.name}
            />
            <Text>
                {user.email}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button variant='ghost'>Secondary Action</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default ProfileModel