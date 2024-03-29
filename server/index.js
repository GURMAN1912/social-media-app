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

const __filename=fileURLToPath(import.meta.url)
// const __dirname =path.resolve()
dotenv.config()
const app =express()
app.use(express.json())
// app.use(express.static(path.join(__dirname,'client/dist')))
app.use(helmet())
app.use(helmet.crossOriginResourcePolicy({policy:"cross-origin"}))
app.use(morgan('common'))
app.use(bodyParser.json({limit:"30mb" ,extented :true}))
app.use(bodyParser.urlencoded({limit:"30mb",extended:true}))
app.use(cors())
// app.get("*" ,(req,res)=>{
//     res.sendFile(path.join(__dirname,'/client','dist',"index.html"))
// })
// app.use("/assets",express.static(path.join(__dirname,"public/assets")));
app.use(fileUpload({
    useTempFiles:true
}))


const storage=multer.diskStorage({
    destination:function(req,res,cb){
        cb(null,"public/assets")
    },
    filename:function(req,file,cb){
        cb(null,file.originalname)
    }
})
const upload=multer({storage})

app.post("/auth/register",register)
app.post("/posts",verifyToken,createPost)

app.use('/auth',authRoutes)
app.use('/users',userRoutes)
app.use("/posts",postRoutes)

const PORT=process.env.PORT||5000;
mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
}).then(()=>{
    app.listen(PORT,()=>console.log(`Server Port: ${PORT}`))
}).catch((error)=>{
    console.log(`${error} did not connect`)
})