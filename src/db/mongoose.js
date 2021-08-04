const mongoose = require('mongoose')

//connect server to database
mongoose.connect(process.env.MONGODB_URL , {
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology: true
})


