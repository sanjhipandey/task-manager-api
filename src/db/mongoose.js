 const mongoose = require('mongoose')


mongoose.connect(process.env.MONGODB_URL,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,//when mongoose wooks with mongodb it generates index for easy access 
    useFindAndModify:false
})



// const Tasks = mongoose.model('Tasks',{ //mongoose.model takes 'Tasks' and makes it lower case and pours it into the collection name
//     description:{
//     type : String,
//     require:true,
//     trim:true,
    
// },completed:{
//     type: Boolean,
//     default:false,
// }
// })

// const todo = new Tasks({
//     description:'complete Work',
   
//     completed:true    
// })

// todo.save().then(()=>{
//     console.log(todo)
// }).catch((error)=>{
//     console.log(error)
// })
