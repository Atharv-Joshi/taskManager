const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')

const router = new express.Router()

//-------------------------------------User endpoints-----------------------------------------------------------------------------------------------
//post user
router.post('/users' , async (req , res) => {
    const user = new User(req.body)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user , token})
    }catch(e){
        res.status(400).send(e)
    }
})

//login
router.post('/users/login' , async (req, res) =>{
    try{
        const user = await User.findByCredentials(req.body.email , req.body.password)
        const token = await user.generateAuthToken()
        res.send({user , token})
    }
    catch(e){
        res.status(400).send()
    }
})

//logout from current session
router.post('/users/logout' , auth , (req , res) => {
    try{
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        )
        req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//logout from all sessions
router.post('/users/logoutall' , auth , (req , res) => {
    try{
        req.user.tokens = []
        req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})


//read all users
router.get('/users/me' , auth ,  async (req , res) => {
    res.send(req.user)
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
        return res.send(user)
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
        return res.send(user)
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
        return res.send(user)
    }
    catch(e){
        return res.status(500).send(e)
    }
})

//-------------------------------------User endpoints-----------------------------------------------------------------------------------------------

module.exports = router