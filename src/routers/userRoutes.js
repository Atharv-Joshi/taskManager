const express = require('express')
const User = require('../models/user')

const router = new express.Router()

//-------------------------------------User endpoints-----------------------------------------------------------------------------------------------
//post user
router.post('/users' , async (req , res) => {
    const user = new User(req.body)
    try{
        await user.save()
        res.status(201).send(user)
    }catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/login' , async (req, res) =>{
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password)
        res.send(user)
    }
    catch(e){
        res.status(400).send()
    }
})

//read all users
router.get('/users' , async (req , res) => {
    try{
        const users = await User.find({})
        res.status(201).send(users)
    }catch(e){
        res.status(500).send(e)
    }
})

//read user by id
//:id means that it is a placeholder for dynamic values (here user id will be placed) which can be accessed by req.params.id
router.get('/users/:id' , async (req , res) =>{
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

//update user
router.patch('/users/:id' , async (req , res) =>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name' , 'email' , 'password' , 'age']

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
        // const user = await User.findByIdAndUpdate(req.params.id , req.body , {new : true , runValidators : true})

        //writing it in this way is necessary so that middleware runs
        const user = await User.findById(req.params.id)
        updates.forEach(
            (update) => user[update] = req.body[update]
        )
        await user.save()
        if(!user){
            return res.status(404).send()
        }
        return res.status(201).send(user)
    }
    catch(e){
        res.send(500).send()
    }
}
)

router.delete('/users/:id' , async (req , res) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id)
        if(!user){
            return res.status(404).send()
        }
        return res.status(201).send(user)
    }
    catch(e){
        return res.status(500).send(e)
    }
})

//-------------------------------------User endpoints-----------------------------------------------------------------------------------------------

module.exports = router