import { Box, isMuiElement, useMediaQuery } from '@mui/material'
import Navbar from 'components/Navbar'
import MyPostWidgit from 'pages/widgits/MyPostWidgit'
import UserWidget from 'pages/widgits/UserWidgit'
import React from 'react'
import PostsWidget from 'pages/widgits/PostsWidgits'
import FriendListWidget from 'pages/widgits/FriendsListWidget'
import { useSelector } from 'react-redux'

const Homepage = () => {
  const isNonMobileScreens=useMediaQuery("(min-width:1000px)")
  const {_id,userPicturePath}=useSelector((state)=>state.user)

  return (
    <Box>
      <Navbar/>
      <Box 
        width='100%'
        padding="2rem 6%"
        display={isNonMobileScreens?"flex":"block"}
        gap='0.5rem'
        justifyContent='space-between'
        >
          <Box flexBasis={isNonMobileScreens?"26%":undefined}>
            <UserWidget userId={_id} userPicturePath={userPicturePath}/>
          </Box>
          <Box 
            flexBasis={isNonMobileScreens?"42%":undefined}
            mt={isNonMobileScreens? undefined:"2rem"}
          >
            <MyPostWidgit userPicturePath={userPicturePath}/>
            <PostsWidget userId={_id} />
          </Box>
          {isNonMobileScreens && (
            <Box flexBasis='26%'>
              <Box m="2rem 0" />
            <FriendListWidget userId={_id} />
            </Box>
          )}
      </Box>
    </Box>
  )
}

export default Homepage
