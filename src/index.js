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


//post user
app.post('/users' , (req , res) => {
    const user = new User(req.body)
    user.save().then(
        (user) =>{
            res.send(user)
        }
    ).catch(
        (e) =>{
            res.status(400).send(e)
        }
    )
})

//read all users
app.get('/users' , (req , res) => {
    User.find({}).then(
        (users) => {
            res.send(users)
        }
    ).catch(
        (e) =>{
            res.status(500).send()
        }
    )
})

//read user by id
//:id means that it is a placeholder for dynamic values (here user id will be placed) which can be accessed by req.params.id
app.get('/users/:id' , (req , res) =>{
    const _id = req.params.id
    User.findById(_id).then(
        (user) =>{
            if(!user){
                console.log(user)
                return res.status(404).send()
            }
            res.send(user)
        }
    ).catch(
        (e) =>{
            res.status(500).send(e)
        }
    )
}
)


//post task
app.post('/tasks' , (req , res) => {
    const task = Task(req.body)
    task.save().then(
        (task) =>{
            res.send(task)
        }
    ).catch(
        (e) =>{
            res.status(400).send(e)
        }
    )
})

//read all tasks
app.get('/tasks' , (req , res) => {
    Task.find({}).then(
        (tasks) =>{
            res.send(tasks)
        }
    ).catch(
        (e) =>{
            res.status(500).send()
        }
    )
})

//read task by id
//:id means that it is a placeholder for dynamic values (here task id will be placed) which can be accessed by req.params.id
app.get('/tasks/:id' , (req , res) =>{
    const _id = req.params.id
    Task.findById(_id).then(
        (task) =>{
            if(!task){
                return res.status(404).send()
            }
            res.send(task)
        }
    ).catch(
        (e) =>{
            res.status(500).send(e)
        }
    )
})



app.listen(port , () =>{
    console.log('server up on ' + port)
})