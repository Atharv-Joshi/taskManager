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

//This code makes the middleware function run for all incoming routes.
// app.use((req,res,next) =>{
//     res.status(503).send('Site Under Maintainance')
// })

//express. json() is a method inbuilt in express to recognize the incoming Request Object as a JSON Object
//if not written then incoming object is indentified as undefined.
app.use(express.json())

//registering user and task routers with express app
app.use(userRouter)
app.use(taskRouter)

module.exports = app