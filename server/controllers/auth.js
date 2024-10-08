import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true

  });

export const register = async (req, res) => {
  try {
    const file = req.files.picture;
    
    // Default profile picture in case of any errors
    let uploadedPic = "https://www.pngarts.com/files/10/Default-Profile-Picture-Transparent-Image.png";
    
    if (file) {
      // Upload image to Cloudinary and wait for the result
      const result = await cloudinary.uploader.upload(file.tempFilePath);
      console.log(result);
      uploadedPic = result.url;
    }

    const {
      firstName,
      lastName,
      email,
      password,
      picturePath,
      userPicturePath,
      friends,
      location,
      occupation,
    } = req.body;

    // Generate password hash
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create new user with uploaded picture
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
      picturePath,
      userPicturePath: uploadedPic, // Use the uploaded image URL
      friends,
      location,
      occupation,
      viewedProfile: Math.floor(Math.random() * 1000),
      impressions: Math.floor(Math.random() * 1000),
    });

    // Save user to the database
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const foundUser = await User.findOne({ email });
    if (!foundUser) return res.status(400).json({ msg: "User not found!..." });

    // Compare password
    const isMatch = await bcrypt.compare(password, foundUser.password);
    if (!isMatch) return res.status(400).json({ msg: "Wrong password..." });

    // Sign JWT token
    const token = jwt.sign({ id: foundUser._id }, process.env.JWT_SECRET);
    res.status(200).json({ token, foundUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
