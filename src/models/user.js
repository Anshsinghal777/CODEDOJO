import mongoose from 'mongoose';
import { Schema } from 'mongoose';
const userSchema = new Schema({
    firstName: {
        type: String,
        required : true,
        minLength: 3,
        maxLength: 20,
    },
    lastName: {
        type: String,
        minLength: 3,
        maxLength: 20,

    },

    emailID : {
        type: String,
        required : true,
        unique : true,
        trim : true,
        lowercase : true,
        immutable : true,
    },
    age : {
        type :Number,
        min : 6,
        max : 80,
    },
    role:{
        type : String,
        enum : ['admin','user'],
        default : 'user',
    },
    problemSolved : {
        type : [String],
    }, 
      password : {
        type : String,
        required : true,
        
      }



} , {timestamps : true});

const User = mongoose.model('User', userSchema);
export default User;

