import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
import multer from "multer"
import helmet from "helmet"
import morgan from "morgan"
import path from "path"
import authRoutes from './routes/auth.routes.js'
import userRoutes from "./routes/user.routes.js"
import postRoutes from './routes/post.routes.js'
import { fileURLToPath } from "url"
import {register} from './controllers/auth.js'
import { verifyToken } from "./middleware/auth.middleware.js"
import {createPost} from './controllers/posts.js'
import fileUpload from "express-fileupload"
import cloudinary from 'cloudinary'

const __filename = fileURLToPath(import.meta.url);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors({
    origin: ['http://your-frontend-domain.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Add the HTTP methods you need
    allowedHeaders: ['Content-Type', 'Authorization'],  // Add custom headers if necessary
    credentials: true,  // If you're using cookies or tokens
  }));
app.use(fileUpload({ useTempFiles: true }));
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    secure: true

  });
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/assets");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

app.post("/auth/register", register);
app.post("/posts", verifyToken, createPost);

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use("/posts", postRoutes);

const PORT = process.env.PORT || 4001;

// Only start the server after MongoDB is connected
mongoose.connect(process.env.MONGO_URL, {
}).then(() => {
    app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
}).catch((error) => {
    console.log(`${error} did not connect`);
});
