const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//-------------------------------------Task endpoints-----------------------------------------------------------------------------------------------

//post task
router.post('/tasks' , auth , async (req , res) => {
    // const task = Task(req.body)
    const task = new Task({
        ...req.body,
        user  : req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//read all tasks
//GET /tasks to get all tasks
//GET /tasks?completed=true/false
//GET /tasks?limit=10&skip=10
//GET /tasks?sortBy=createdAt:asc
router.get('/tasks' , auth , async (req , res) => {
    const match = {}    
    const sort = {}

    if(req.query.completed){
        match.completed =  req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{
        // const tasks = await Task.find({})
        await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit : parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort
            }
        }
            ).execPopulate()
        res.send(req.user.tasks)
    }
    catch(e){
        res.status(500).send(e)
    }
    
})

//read task by id
//:id means that it is a placeholder for dynamic values (here task id will be placed) which can be accessed by req.params.id
router.get('/tasks/:id' , auth ,  async (req , res) =>{
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id , user : req.user._id})
        if(!task){
            return res.send(404).send()
        }
        return res.send(task)
    }
    catch(e){
        res.status(500).send()
    }
})

//update task
router.patch('/tasks/:id' , auth ,  async (req , res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description' , 'completed']

    //this checks if the properties client wants to update are allowed to update or not
    const isValidOperation = updates.every(
        (update) => allowedUpdates.includes(update)
    )
    
    if(!isValidOperation){
        return res.status(400).send({'Error' : 'Invalid Updates'})
    }

    try{
        //findIdAndUpdate function ignores middleware functions and directly update in db.
        //but since we are writing code for hasing passwords in middle we need it to run. 
        //So instead of usingan advanced function we will do it manually.
        // const task = await Task.findByIdAndUpdate(req.params.id , req.body , {new : true , runValidators : true})

        // const task = await Task.findById(req.params.id)
        const task = await Task.findOne({_id : req.params.id , user : req.user._id})

        if(!task){
            return res.status(404).send()
        }

        updates.forEach(
            (update) => task[update] = req.body[update]
        )
        await task.save()

        res.send(task)
    }
    catch(e){
        res.status(400).send(e)
    }
}
)


router.delete('/tasks/:id' , auth ,  async (req , res) => {
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOneAndDelete({_id : req.params.id , user : req.user._id})
        if(!task){
            return res.status(404).send()
        }
        return res.send(task)
    }
    catch(e){
        return res.status(500).send(e)
    }
})

//-------------------------------------Task endpoints-----------------------------------------------------------------------------------------------

module.exports = router