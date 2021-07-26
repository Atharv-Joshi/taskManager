const mongoose = require('mongoose')

//connect server to database
mongoose.connect('mongodb://127.0.0.1:27017/task-manager' , {
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology: true
})


