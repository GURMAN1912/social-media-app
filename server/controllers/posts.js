import Post from '../models/post.model.js'
import User from '../models/user.js';

export const createPost=async(req,res)=>{
    try{
        const {userId,description,picturePath}=req.params;
        const user =await User.findById(userId)

        const newPost= new Post({
            userId,
            firstName:user.firstName,
            lastName:user.lastName,
            location:user.location,
            description,
            userPicturePath:user.userPicturePath,
            picturePath,
            likes:{},
            comments:[]
        })
        await newPost.save();
        const posts= await Post.find();
        res.status(201).json(posts)
    }
    catch(err){
        res.status(409).json({message:err.message})
    }
}

export const getFeedPosts=async(req,res)=>{
    try{
        const posts=await Post.find();
        res.status(200).json(posts);
    }
    catch(err){
        res.status(404).json({message:err.message})
    }
}

export const getUserPosts=async(req,res)=>{
    try{
        const {userId}=req.params;
        const userPost=await Post.findById(userId)
        res.status(200).json(userPost)
    }
    catch(err){
        res.status(404).json({message:err.message})
    }
}

export const likePost=async(req,res)=>{
    try{
        const {id}=req.params;//post id
        const {userId}=req.body;// user which likes or unlikes the post
        const post =await Post.findById(id);
        const isLiked=post.likes.get(userId)

        if(isLiked){
            post.likes.delete(userId)

        }
        else{
            post.likes.set(userId,true);
        }

        const updatedPost=await Post.findByIdAndUpdate(id,
            {
                likes:post.likes
            },{new:true})
        res.status(202).json(updatedPost)
    }

    catch(err){
        res.status(404).json({message:err.message})
    }
}
