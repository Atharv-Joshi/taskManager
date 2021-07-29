const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
            unique : true,
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
        },
        tokens : [
            {
                token : {
                    type : String,
                    required : true
                }
            }
        ]
    }
)

//middleware
// for middle we use normal functions since we require 'this' keyword here and there is no 'this' binding in arrow functions .

//function for hashing plain text password
userSchema.pre('save' , async function (){
    const user = this
    //only update password if its modified in post or patch request.
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password , 8)
    }
})

//function for logging user in
userSchema.statics.findByCredentials = async  (email , password) => {
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to Login')    
    }
    const isMatch = bcrypt.compare(password , user.password)
    if(!isMatch){
        throw new Error('Unable to Login')
    }
    return user
}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({_id : user._id.toString()} , 'taskmanager')
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

//User Model
const User = mongoose.model('User' , userSchema)


module.exports = User