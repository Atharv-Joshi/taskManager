const app = require('./app')

//specifying port
const port = process.env.PORT

app.listen(port , () =>{
    console.log('server up on ' + port)
})