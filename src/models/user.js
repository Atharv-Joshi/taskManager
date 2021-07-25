const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

//User schema
const userSchema = new mongoose.Schema(
    {
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

//middleware
// for middle we use normal functions since we require 'this' keyword here and there is no 'this' binding in arrow functions .
userSchema.pre('save' , async function (){
    const user = this
    //only update password if its modified in post or patch request.
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 8)
    }
})

//User Model
const User = mongoose.model('User' , userSchema)


module.exports = User