const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Tasks = require('./task')


const userSchema = new mongoose.Schema({ //accepts two arguments, one is the string name of model and the other is definition to define the fields 
    name: {
        type: String,
       required:true,
       trim:true
    },
    email:{
        type: String,
        required :true,
        trim:true,
        unique:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('email is invalid')
            }
        }
    },
    age: {
        type:Number,// this whole thing is validation
        default:0,
        require:true,
        validate(value){
            if(value<7){
                throw new Error('Age must be a positive number')
            }
        }
    },
    password:{
        type:String,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes("password")){
                throw new Error('Password contains "password"')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type: Buffer//allow us to store data in buffer of binary image alongside of the user who the data belongs to 
    }

},{
    timestamps: true
} )

userSchema.virtual('tasks',{ //virtual property is not actual data stored in data base but a relationship
    ref:'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens

    return userObject
}

userSchema.methods.generateAuthToken = async function () {//methods for methods on user
    const user = this
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    
    return token
}



userSchema.statics.findByCredentials = async(email, password) => {//statics for methods on actual User model
    const user = await User.findOne({email})
     if(!user){
         throw new Error ('Unable to login')
     }   
     
     const isMatch = await bcrypt.compare(password, user.password)

     if(!isMatch){
         throw new Error('Unable to login')
     }

     return user
    
}

userSchema.pre('save', async function(next){ //standard function for this binding 
    const user = this
   if(user.isModified('password')){
       user.password = await bcrypt.hash(user.password, 8)
   }

    next() //important to make sure next is called or it keeps running 
})

userSchema.pre('remove', async function(next){
    const user = this
    await Tasks.deleteMany({owner: user._id})
    next()
})

const User = mongoose.model('User',userSchema)
    
    // const me = new User({
    //     name: 'Sanjhi',
    //     email:'psanjhi@gmail.com',
    //     age: '21',
    //     password:'loooooool'
    //     })

    module.exports=User