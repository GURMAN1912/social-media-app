// import { Promise } from "mongoose";
import User from "../models/user.js";

export const getUser=async(req,res)=>{
    try{
        const {id}=req.params
        const user=await User.findById(id)
        res.status(200).json(user)
    }
    catch(err){
        res.status(404).json({message:err.message})
    }
}
export const getUserFriends=async(req,res)=>{
    try {
        const {id}=req.params;
        const user=await User.findById(id)
        const friends=await Promise.all(
            user.friends.map((id)=>User.findById(id))
        )
        const formattedFriends=friends.map(({
            _id,firstName,lastName,occupation,location,userPicturePath
        })=>{
            return {_id,firstName,lastName,occupation,location,userPicturePath}
        })        
        res.status(200).json(formattedFriends)
    } catch (error) {
        res.status(404).json({message:error.message})
    }
}
export const addRemoveFriends=async(req,res)=>{
    try{
        const {id,friendId}=req.params;
        const user=await User.findById(id);
        const friend=await User.findById(friendId);
        console.log(user)
        console.log(friend)

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== id);
        } 
        else{
            user.friends.push(friendId);
            friend.friends.push(id);
        }
        console.log(user)
        console.log(friend)
        await user.save()
        await friend.save()
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
          );
        const formattedFriends=friends.map(({
            _id,firstName,lastName,occupation,location,userPicturePath
        })=>{
            return {_id,firstName,lastName,occupation,location,userPicturePath}
        })        
        res.status(200).json(formattedFriends)

    }
    catch(err){
        res.status(404).json({message:err.message})
    }
}
export const searchUser= async (req, res) => {
    const { q } = req.query;
  
    try {
      // Fetch users from the database based on the search query
      const users = await User.find({ firstName: { $regex: new RegExp(q, 'i') } });
  
      res.json(users);
    } catch (error) {
      console.error('Error searching users:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };