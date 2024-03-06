import { Box } from '@mui/material'
import Navbar from 'components/Navbar'
import React from 'react'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FlexBetween from 'components/FlexBetween';
import { Search,Message,DarkMode,LightMode,Notifications,Help,Menu,Close} from '@mui/icons-material'
import {IconButton,InputBase,Typography,Select,MenuItem,FormControl,useTheme,useMediaQuery} from "@mui/material"
import Friends from 'components/Friends'
import WidgetWrapper from 'components/WidgetWrapper'
export default function Searchpage() {
    const [isMoblieMenuToggle,setIsMobileMenuToggle]=useState(false)
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const user=useSelector((state)=>state.user)
    const isNonMobileScreens=useMediaQuery("(min-width:1000px")
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const theme=useTheme();
    const neutralLight=theme.palette.neutral.light;
    const dark=theme.palette.neutral.dark;
    const backgroud=theme.palette.background.default;
    const primaryLight=theme.palette.primary.light;
    const alt=theme.palette.background.alt;
    const token=useSelector((state)=>state.token)

    const handleSearch = async () => {
        try {
          const response = await fetch(`http://localhost:4000/users?q=${query}`,{
            method: "GET",
        headers: { Authorization: `Bearer ${token}` },
          });
          const data=await response.json()
          setSearchResults(data);
          console.log(searchResults)
        } catch (error) {
          console.error('Error searching users:', error);
        }
      };

  return (
    <Box>
        <Navbar/>
        <FlexBetween m="2rem 4rem"  backgroundColor={neutralLight} borderRadius="9px" gap="3rem" padding="0.1rem 1.5rem">
                    <InputBase  placeholder='Search..' value={query} onChange={(e) => setQuery(e.target.value)}/>
                    <IconButton  onClick={handleSearch}>
                        <Search/>
                    </IconButton>
        </FlexBetween>
            <Box m="2rem 4rem">
                <Typography fontSize="3rem">
                    Search Result for {query}
                </Typography>
            </Box>
            <WidgetWrapper>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {searchResults?.map((friend) => (
          <Friends
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.userPicturePath}
          />
        ))}
      </Box>
    </WidgetWrapper>

    </Box>
  )
}
