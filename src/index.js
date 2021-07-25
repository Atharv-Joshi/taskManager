const express = require('express')

//this statement ensures that mongoose.js runs and app is connected to database when the program runs 
require('./db/mongoose')

//importing router files
const userRouter = require('./routers/userRoutes')
const taskRouter = require('./routers/taskRoutes')

//models
const User = require('./models/user')
const Task = require('./models/task') 

//creating express app
const app = express()

//specifying port
const port = process.env.PORT || 3000

//express. json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object
//if not written then incoming object is indentified as undefined.
app.use(express.json())

//registering user and task routers with express app
app.use(userRouter)
app.use(taskRouter)

app.listen(port , () =>{
    console.log('server up on ' + port)
})