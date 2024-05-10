import React from 'react'
import { Badge } from '@chakra-ui/react'
import { CloseIcon } from '@chakra-ui/icons'
function UserBadge({user,handleFunction}) {
  return (
  <Badge
  px={2}
  py={1}
  borderRadius={'lg'}
  m={1}
  mb={2}
  variant={'solid'}
  fontSize={12}
  colorScheme='purple'
  onClick={handleFunction}
  >{user.name} <CloseIcon pl={1}/></Badge>
  )
}

export default UserBadge
