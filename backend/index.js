import express from 'express'
import userRouter from './routes/user.routes.js'
import cors from 'cors'
import connectDB from './db/index.js';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config()

const app = express();

const port = process.env.PORT || 8000;

app.use(cookieParser())

app.use(cors({
    origin:"http://localhost:5174",
    credentials: true,
}));

//data body sa aa raha hu allow karo
app.use(express.json());
//data url sa aa raha hu allow karo
app.use(express.urlencoded({extended: true}))

app.use("/coding/contest/user", userRouter)

connectDB()
.then(() => {
    app.listen(port, ()=> {
        console.log(`Server is running at port : ${port}`)
    })
})
.catch((error) => {
    console.log(`Mongo DB connection FAILED on server !!! ${error}`)
}) 
