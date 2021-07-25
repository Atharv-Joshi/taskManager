const express = require('express')
const Task = require('../models/task')

const router = new express.Router()

//-------------------------------------Task endpoints-----------------------------------------------------------------------------------------------

//post task
router.post('/tasks' , async (req , res) => {
    const task = Task(req.body)
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})

//read all tasks
router.get('/tasks' , async (req , res) => {
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
router.get('/tasks/:id' , async (req , res) =>{
    const _id = req.params.id
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

//update task
router.patch('/tasks/:id' , async (req , res) => {
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

        const task = await Task.findById(req.params.id)
        updates.forEach(
            (update) => task[update] = req.body[update]
        )
        task.save()

        if(!task){
            return res.status(404).send()
        }
        return res.status(201).send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
}
)


router.delete('/tasks/:id' , async (req , res) => {
    try{
        const task = await Task.findByIdAndDelete(req.params.id)
        if(!task){
            print(console.log(task))
            return res.status(404).send()
        }
        return res.status(201).send(task)
    }
    catch(e){
        return res.status(500).send(e)
    }
})

//-------------------------------------Task endpoints-----------------------------------------------------------------------------------------------

module.exports = router