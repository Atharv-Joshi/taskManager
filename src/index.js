const express = require('express')

//this statement ensures that mongoose.js runs and app is connected to database when the program runs 
require('./db/mongoose')

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

//-------------------------------------User endpoints-----------------------------------------------------------------------------------------------
//post user
app.post('/users' , async (req , res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

//read all users
app.get('/users' , async (req , res) => {
    try{
        const users = await User.find({})
        res.status(201).send(users)
    }catch(e){
        res.status(500).send(e)
    }
})

//read user by id
//:id means that it is a placeholder for dynamic values (here user id will be placed) which can be accessed by req.params.id
app.get('/users/:id' , async (req , res) =>{
    const _id = req.params.id
    try{
        const user = await User.findById(_id)
        if(!user){
            return res.status(404).send()
        }
        return res.status(201).send(user)
    }
    catch(e){
        res.status(500).send(e)
    }
}
)

//-------------------------------------User endpoints-----------------------------------------------------------------------------------------------


//-------------------------------------Task endpoints-----------------------------------------------------------------------------------------------

//post task
app.post('/tasks' , async (req , res) => {
    const task = Task(req.body)
    // task.save().then(
    //     (task) =>{
    //         res.send(task)
    //     }
    // ).catch(
    //     (e) =>{
    //         res.status(400).send(e)
    //     }
    // )
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//read all tasks
app.get('/tasks' , async (req , res) => {
    // Task.find({}).then(
    //     (tasks) =>{
    //         res.send(tasks)
    //     }
    // ).catch(
    //     (e) =>{
    //         res.status(500).send()
    //     }
    // )
    try{
        const tasks = await Task.find({})
        res.status(201).send(tasks)
    }
    catch(e){
        res.status(500).send(e)
    }
    
})

//read task by id
//:id means that it is a placeholder for dynamic values (here task id will be placed) which can be accessed by req.params.id
app.get('/tasks/:id' , async (req , res) =>{
    const _id = req.params.id
    // Task.findById(_id).then(
    //     (task) =>{
    //         if(!task){
    //             return res.status(404).send()
    //         }
    //         res.send(task)
    //     }
    // ).catch(
    //     (e) =>{
    //         res.status(500).send(e)
    //     }
    // )
    try{
        const task = await Task.findById(_id)
        if(!task){
            return res.send(404).send()
        }
        return res.status(201).send(task)
    }
    catch(e){
        res.status(500).send()
    }
})


//-------------------------------------Task endpoints-----------------------------------------------------------------------------------------------


app.listen(port , () =>{
    console.log('server up on ' + port)
})