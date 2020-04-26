const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Tasks = require('./models/task')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


const app = express()
const port = process.env.PORT 


// app.use((req, res, next)=>{
//     // console.log(req.method, req.path)
//     // next()
//     if(req.method==='GET'){
//         res.send('GET requests are disabled')
//     }else{
//         next()
//     }
// })

// app.use((req,res,next)=>{
//     res.status(503).send('Site is currently in maintainance mode.Come back soon !')
// })


app.use(express.json()) //helps parse incoming json data into object so that it can be accessed 
app.use(userRouter)
app.use(taskRouter)


// const router = new express.Router() //creating new router
// router.get('/test', (req, res) => {
//     res.send('This is from my router')
// })
//app.use(router) //registering it with express application(without this it wont work)


//const bcrypt = require('bcryptjs')

// const jwt = require('jsonwebtoken')
// const myFunction = async() => {
//     // const password ='RED12344'
//     // const hashedPassword = await bcrypt.hash(password, 8) //no of times the algorithm has to run

//     // // console.log(password)
//     // // console.log(hashedPassword)

//     // const isMatch = await bcrypt.compare('RED12344', hashedPassword)
//     // //console.log(isMatch)

//     const token = jwt.sign({ _id: 'abc123'}, 'thisismynewcourse',{expiresIn:'7 days'})//return value of sign method is token which is further used for authentication
//     console.log(token)
//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }
// myFunction()


app.listen(port, ()=>{
    console.log('Server is up on port' + port)
})

// const pet = {
//     name: 'Hal'
// }

// pet.toJSON = function(){//tojson is a function that converts it to json
//     //.json helps us modify the data object and then send it modifying whatever parameter
//     console.log(this)//this is access to object
//     return this
// }
// console.log(JSON.stringify(pet))//stringify coverts json to string

const multer = require('multer')
const upload = multer({
    dest: 'images',
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){//property
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload an image'))
        }
        // cb(new Error('File must be a PDF'))
        //cb(undefined, true)
        //cb(undefined, false)
    }
})


// const errorMiddleware = (req,res,next) =>{
//     throw new Error ('From my middleware')
// }
app.post('/upload', upload.single('upload'), (req, res)=>{
    res.send()
},(error, req, res, next)=>{//providing another function
    res.status(400).send({error: error.message})
})

const main = async () =>{
    // const task = await Tasks.findById('5ea312cd04e318285084ad1f')
    // await task.populate('owner').execPopulate() //find the user associate with the task 
    // console.log(task.owner)

//     const user = await User.findById('5ea30f891defab3eb08f925d')
//    await user.populate('tasks').execPopulate()
//     console.log(user.tasks)


}

main()