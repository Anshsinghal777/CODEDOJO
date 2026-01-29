
import User from '../models/user.js';
import validate from '../utils/validator.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import redisClient from '../config/redis.js';
const register = async (req, res) => {

    try{

        validate(req.body);
        req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.role = 'user';

        
        const user = await User.create(req.body);
     const token =    jwt.sign({ emailID : req.body.emailID , role : "user"}, process.env.JWT_SECRET_KEY, {expiresIn : '1h'});
        res.cookie('token', token,  {maxAge : 60*60*1000});
        res.status(201).json({message : "User registered successfully"});
    }

    catch(err){
        res.status(400).json({message : "Internal Server Error", error : err.message});
    }


}


const login = async (req, res) => {

    try{
        const {emailID, password} = req.body;
        if(!emailID || !password){

            throw new Error('invalid credentials');
        }    

        const user = await User.findOne({emailID : emailID});
        if(!user){
            throw new Error('User not found');
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            throw new Error('Invalid credentials');
        }
        const token =    jwt.sign({ emailID : req.body.emailID , role : user.role}, process.env.JWT_SECRET_KEY, {expiresIn : '1h'});
        res.cookie('token', token,  {maxAge : 60*60*1000});
        res.status(200).json({message : "User logged in successfully"});

    }


    catch(err){
        res.status(400).json({message : "Internal Server Error", error : err.message});
    }
}

const logout = async (req, res) => {

    try{

        const { token } = req.cookies;
        const payload = jwt.decode(token);
        await redisClient.set(`token-${token}`, 'blockeed');
            await redisClient.expireAt(`token-${token}`, payload.exp);
        res.clearCookie('token');
        res.status(200).json({message : "User logged out successfully"});
        


    }
    catch(err){
        res.status(400).json({message : "Internal Server Error", error : err.message});
}

}

const adminRegister = async (req, res) => {
  try{

        validate(req.body);
        req.body.password = await bcrypt.hash(req.body.password, 10);
        req.body.role = 'admin';

        
        const user = await User.create(req.body);
     const token =    jwt.sign({ emailID : req.body.emailID , role : "admin"}, process.env.JWT_SECRET_KEY, {expiresIn : '1h'});
        res.cookie('token', token,  {maxAge : 60*60*1000});
        res.status(201).json({message : "admin registered successfully"});
    }

    catch(err){
        res.status(400).json({message : "Internal Server Error", error : err.message});
    }
    


}

export { register, login , logout , adminRegister}; 