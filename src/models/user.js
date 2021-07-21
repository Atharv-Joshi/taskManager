const mongoose = require('mongoose')
const validator = require('validator')


//User Model
const User = mongoose.model('User' , {
    name : {
        type : String,
        required : true,
        trim : true,
        
    },
    age : {
        type : Number,
        default : 0,
        validate(value){
            if(value < 0){
                throw new Error('Age cannot be negative')
            }
        }   
    },
    email : {
        type : String,
        trim : true,
        required: true,
        lowercase : true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Invalid Email')
            }
        }
    },
    password : {
        type : String,
        required : true,
        trim : true,
        minLength : 7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain "password"')
            }
        }
    }
}
)

module.exports = User