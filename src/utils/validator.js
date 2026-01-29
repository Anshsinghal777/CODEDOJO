import validator from 'validator';


const validate = (data)=>{

const mandatoryFields = ['firstName', 'emailID', 'password'];
const IsAllowed = mandatoryFields.every((k) => Object.keys(data).includes(k));

if(!IsAllowed){
    throw new Error('Missing mandatory fields');
};

if(!validator.isEmail(data.emailID)){
    throw new Error('Invalid Email ID');
}
if(!validator.isStrongPassword(data.password)){
    throw new Error('Password is not strong enough');
}
}
export default validate;