const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({description:{
    type : String,
    require:true,
    trim:true,
    
},completed:{
    type: Boolean,
    default:false,
}
,owner:{
    type:mongoose.Schema.Types.ObjectId, //data stored is gonna be objectID
    require: true,
    ref:'User'
}},{
    timestamps:true
})
//const Tasks = mongoose.model('Tasks',{ //mongoose.model takes 'Tasks' and makes it lower case and pours it into the collection name
    

const Tasks = mongoose.model('Tasks',userSchema)



module.exports = Tasks