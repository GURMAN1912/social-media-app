// import { Box } from '@mui/material'
import Navbar from 'components/Navbar'
import React from 'react'
import From from '../../components/Form'
import {Box,Typography,useTheme,useMediaQuery} from '@mui/material'

const Loginpage = () => {
  const theme =useTheme();
  const isNonMobileScreens=useMediaQuery("min-width:1000px")

  return (
    <Box >
      {/* <Navbar/> */}
      <Box 
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1rem 6%"
        >
          <Typography fontWeight="bold" fontSize="32px" color="primary">
            SocailMedia
          </Typography>
        </Box>
        <Box width={isNonMobileScreens? "50%":"93%"}
          p="2rem"
          m="2rem auto"
          borderRadius="1.5rem"
          backgroundColor={theme.palette.background.alt}
          >
            <Typography fontWeight='500' variant='h5'sx={{mb:"1.5rem"}}>
              welcome to Social Media website.....
            </Typography>
            <From/>
        </Box>
    </Box>
  )
}

export default Loginpage

