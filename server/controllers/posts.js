import Post from '../models/post.model.js'
import User from '../models/user.js';
import {v2 as cloudinary} from 'cloudinary'

export const createPost=async(req,res)=>{
    const {userId,description,picturePath}=req.body;
    const user =await User.findById(userId)
    const file=req.files.picture;
    cloudinary.uploader.upload(file.tempFilePath, async(err,result)=>{
        console.log(result);
        try{
            const newPost= new Post({
                userId,
                firstName:user.firstName,
                lastName:user.lastName,
                location:user.location,
                description,
                userPicturePath:user.userPicturePath,
                picturePath:result.url,
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
    })
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
        const userPost=await Post.find({userId})
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
export const commentPost = async (req, res) => {
    const { id } = req.params;
    const { comment } = req.body;
    console.log(comment)

    try {
        const post = await Post.findById(id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        // Update post with new comment
        post.comments.push(comment);
        const updatedPost = await post.save();

        res.json(updatedPost);
    } catch (error) {
        console.error('Error commenting on post:', error);
        res.status(500).json({ message: "Server error" });
    }
};
export const deletePost = async (req, res) => {
    try {
        const id=req.params
        const postId = req.body;
        const post=await Post.findById(postId)
        if(id===post.userId)
        {
            const result = await PostMessage.findByIdAndDelete(postId);
        }
        // if (!mongoose.Types.ObjectId.isValid(id))
        //     return res.status(404).send('No post with that id');

        if (!result) {
            return res.status(404).json({ message: 'Post not found' });
        }
        return res.status(200).send({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}