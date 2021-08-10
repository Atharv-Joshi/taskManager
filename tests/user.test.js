const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = mongoose.Types.ObjectId()
const user1 = {
    _id : userOneId,
    name : "TestUser",
    password: 'qwerty1234',
    email: 'test@test.com',
    tokens : [
        {
            token : jwt.sign({_id : userOneId} , process.env.JWT_SECRET)
        }
    ]
}

//runs before each case
beforeEach(async () =>{
    await User.deleteMany()
    await User(user1).save()
})

test('should signup a new user' , async () => {
    await request(app).post('/users').send({
    name : "Sandhya",
    email : "joshi@me.com",
    password : "qwerty123"
    }).expect(201)
})

test('should login user' , async () => {
    await request(app).post('/users/login').send({
        email : user1.email,
        password : user1.password   
    }).expect(200)
})

test('should not login nonexistent user' , async () => {
    await request(app).post('/users/login').send({
        email : 'nonexistent@pro.com',
        password : 'qweryuio'   
    }).expect(400)
})

test('should get user profile' , async() =>{
    await request(app)
        .get('/users/me')
        .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get user profile' , async() =>{
    await request(app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('should delete user profile' , async() =>{
    await request(app)
        .delete('/users/me')
        .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not delete user profile' , async() =>{
    await request(app)
        .delete('/users/me')
        .send()
        .expect(401) 
})

test('upload profile pic' , async() =>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
        .attach('avatar' , 'tests/fixtures/wticher3.jpg')
        .expect(200)
})

test('should update user data' , async() =>{
    await request(app)
        .patch('/users/me')
        .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
        .send({
            name : 'updatedTestUser'
        }).expect(200)
})

test('should not update invalid user data' , async() =>{
    await request(app)
        .patch('/users/me')
        .set('Authorization' , `Bearer ${user1.tokens[0].token}`)
        .send({
            location : 'updatedTestUser'
        }).expect(400)
})