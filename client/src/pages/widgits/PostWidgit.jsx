import { AddComment, ChatBubbleOutlineOutlined, FavoriteBorderOutlined,FavoriteOutlined,ShareOutlined } from "@mui/icons-material";
import {Box,Divider,IconButton,Typography,useTheme} from "@mui/material"
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friends"
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect, useState } from "react";
import { UseDispatch,useDispatch,useSelector } from "react-redux";
import { setPost } from "state/store";
import { Formik } from "formik";
import {TextField} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import UserImage from "components/UserImage";
const PostWidget=({
    postId,
    postUserId,name,description,location,picturePath,userPicturePath,likes,comments
})=>{
    const [isComments,setIsComments]=useState(false);
    const [comment,setComment]=useState("")
    const dispatch=useDispatch();
    const token =useSelector((state)=>state.token)    
    const loggedInUserId=useSelector((state)=>state.user._id);
    const isLiked=Boolean(likes[loggedInUserId]);
    const likeCount=Object.keys(likes).length;
    const { palette } = useTheme();
    const main = palette.neutral.main;
    const primary = palette.primary.main;
    useEffect(()=>{
        
    },[])

    const AddComment=async(comment)=>{
        console.log(comment)
        try {
            const response = await fetch(`http://localhost:4000/posts/${postId}/comment`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ comment })
            });
    
            if (!response.ok) {
                throw new Error(`Failed to add comment: ${response.status}`);
            }
            const updatedPost=await response.json()
            // Assuming you're using state to manage comments
            setComment([...comment, comment]);
            dispatch(setPost({post:updatedPost}))
            // Clear the comment input field
            setComment("");
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }

    const patchLike=async()=>{
        const response=await fetch(`http://localhost:4000/posts/${postId}/like`,{
            method:"PATCH",
            headers:{
                Authorization:`Bearer ${token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({userId:loggedInUserId})

        });
        const updatedPost=await response.json();
        dispatch(setPost({post:updatedPost}))
    }
    // console.log(postUserId)
    return(
        <WidgetWrapper m="2rem 0">
            <Friend
                postId={postId}
                friendId={postUserId}
                name={name}
                subtitle={location}
                userPicturePath={userPicturePath}/>
                <Typography color={main} sx={{mt:"1rem"}}>
                    {description}
                </Typography>
                {picturePath &&(
                    <img
                        width="100%"
                        height='auto'
                        alt="post"
                        style={{borderRadius: '0.75rem',marginTop:'0.75rem'}}
                        src={picturePath}/>
                )}
                <FlexBetween mt='0.25rem'>
                    <FlexBetween gap='1rem'>
                        <FlexBetween gap="0.3rem">
                            <IconButton onClick={patchLike}>
                                {isLiked ?(
                                    <FavoriteOutlined sx={{color:primary}}/>
                                ):<FavoriteBorderOutlined/>}
                            </IconButton>
                            <Typography>
                                {likeCount}
                            </Typography>
                        </FlexBetween>
                        <FlexBetween gap="0.3rem">
                            <IconButton onClick={()=>setIsComments(!isComments)}>
                                <ChatBubbleOutlineOutlined/>
                            </IconButton>
                            <Typography>{comments.length}</Typography>
                        </FlexBetween>
                    </FlexBetween>
                    <IconButton>
                        <ShareOutlined/>
                    </IconButton>
                </FlexBetween>
                {isComments &&(
                    <Box mt="0.5rem">
                        <Box>
                        {/* <input style={{padding:"10px ", width:'90%', margin:"auto"}} placeholder="comments"/> */}
                        <TextField value={comment} id="standard-basic" onChange={(e)=>setComment(e.target.value)} label="Comment" variant="standard" />
                        <SendIcon onClick={()=>AddComment(comment)} fontSize="medium" sx={{mt:"1rem"}} />
                        </Box>
                        {comments.map((comment,i)=>(
                            <Box key={`${name}-${i}`}>
                                <Divider/>
                                <Typography sx={{color:main,m:'0.5rem',pl:'1rem'}}>
                                    {comment}
                                </Typography>
                            </Box>
                        ))}
                        <Divider/>
                    </Box>
                )}
        </WidgetWrapper>
    )
}
export default PostWidget;