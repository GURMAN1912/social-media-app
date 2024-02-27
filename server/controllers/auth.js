import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken"
import User from '../models/user.js'

export const register= async(req,res)=>{
    try{
        const {
            firstName,
            lastName,
            email,
            password,
            picturePath,
            userPicturePath,
            friends,
            location,
            occupation
        }=req.body;
        const salt=await bcrypt.genSalt();
        const passwordHash=await bcrypt.hash(password,salt);
        const newUser= new User({
            firstName,
            lastName,
            email,
            password:passwordHash,
            picturePath,
            userPicturePath,
            friends,
            location,
            occupation,
            viewedProfile:Math.floor(Math.random()*1000),
            impressions:Math.floor(Math.random()*1000),
        })
        const savedUser=await newUser.save()
        res.status(201).json(savedUser)
    }
    catch(err){
        res.status(500).json({error:err.message});
    }

}
export const login =async(req,res)=>{
    try {
        const {email,password}=req.body;
        const foundUser=await User.findOne({email:email});   
        console.log(foundUser)
        if(!foundUser) return res.status(400).json({msg: "User not found!..."})

        const isMatch=await bcrypt.compare(password,foundUser.password)
        if(!isMatch) return res.status(400).json({msg:"Wrong password..."})

        const token=jwt.sign({id:foundUser.id},process.env.JWT_SECRET)
        delete foundUser.password;
        res.status(200).json({ token, foundUser });
    } catch (err) {
        res.status(500).json({error:err.message});       
    }
}