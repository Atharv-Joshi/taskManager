const mongoose = require('mongoose')

//Task model
const Task = mongoose.model('Task' , {
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
})

module.exports = Task