
import dotenv from 'dotenv';
dotenv.config();
console.log('DB_CONNECT_STRING:', process.env.DB_CONNECT_STRING);

import express from 'express';

import main from './config/db.js';
import cookieParser from 'cookie-parser';
import authRouter from './routes/userAuth.js';
import redisClient from './config/redis.js';
import problemRouter from './routes/problemCreator.js';
import submitRouter from './routes/submit.js';





const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/user', authRouter);
app.use('/problem', problemRouter);
app.use('/submission', submitRouter);

const InitializeConnections = async () => {
    try{
       await Promise.all([
        main(),
        redisClient.connect()
       ]);
       console.log("All connections established successfully");
         app.listen(process.env.PORT,()=>{
        console.log(`Server is running on port ${process.env.PORT}`);
    });


    }    catch(err){
        console.log("Failed to connect", err);
       
    }

}
InitializeConnections();


// git status
// git add .
// git commit -m "updated UI and fixed navbar"
// git push


