const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const sharp = require('sharp')

const router = new express.Router()
const upload = new multer({
    //if destination isnt provided to upload object then the image in request is forwarded to the function which executes for that route.
    // dest : 'avatars',
    limits : { 
        fileSize : 1000000,
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpeg|jpg|png)$/)){
            return cb( new Error('Please upload an Image'))
        }
        cb(undefined , true)
    }
})

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

//upload profile pic
router.post('/users/me/avatar', auth ,  upload.single('avatar') , async (req , res) => {
    const buffer = await sharp(req.file.buffer).png().resize({height : 250 , width : 250}).toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
} , 
//this function runs if there are errors in middle wre function (here file filter)
(error , req , res , next) => {
    res.status(400).send(error.message)
} )

//read profile
router.get('/users/me' , auth ,  async (req , res) => {
    res.send(req.user)
})

//get profile picture
router.get('/users/:id/avatar' , async (req , res) =>{
    try{
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        res.set('Content-Type','image/png')
        res.send(user.avatar)
    }
    catch(e){
        res.status(404).send()
    }
})


//update user
router.patch('/users/me' , auth , async (req , res) =>{
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
        // const user = await User.findById(req.params.id)
        updates.forEach(
            (update) => req.user[update] = req.body[update]
        )
        await req.user.save()

        return res.send(req.user)
    }
    catch(e){
        res.send(500).send()
    }
}
)

//delete profile
router.delete('/users/me' , auth , async (req , res) => {
    try{
        await req.user.remove()
        res.send(req.user)
    }
    catch(e){
        return res.status(500).send(e)
    }
})

//delete profile picture
router.delete('/users/me/avatar' , auth , async (req , res)=>{
    req.user.avatar = undefined
    await req.user.save()
    res.send()

})

//-------------------------------------User endpoints-----------------------------------------------------------------------------------------------

module.exports = router