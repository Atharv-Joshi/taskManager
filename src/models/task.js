const mongoose = require('mongoose')

//task schema
const taskSchema = new mongoose.Schema(
    {
        description : {
            type : String,
            trim : true,
            required : true
    
        },
        completed : {
            type : Boolean,
            default : false
        },
        user : {
            required : true,
            type : mongoose.Schema.Types.ObjectId,
        }
    },
    {
        timestamps : true
    }
)

//Task model
const Task = mongoose.model('Task' , taskSchema)

module.exports = Task