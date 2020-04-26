const express = require('express')
const router = new express.Router()
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const {sendWelcomeEmail, sendGoodbyeEmail} = require('../emails/account')

router.get('/test',(req,res)=>{
    res.send('From a new file')
})

router.post('/users', async (req, res) =>{
    // console.log(req.body)//accessing the object above using req.body
    // res.send('testing !')

    const user = new User(req.body)


    try{
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})

    } catch(e){
        res.status(400).send(e)
    }

    


    // user.save().then(()=>{
    //     res.status(201).send(user)
    // }).catch(()=>{
    //     res.status(400).send(e) //sets the status and sends the error
        
    // })

   
})

router.get('/users/me',auth , async (req,res)=>{
    res.send(req.user)

    })

  

    
    
    // User.find({}).then((user)=>{
    //     res.send(user)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
//})

// router.get('/users/:id', async(req,res)=>{ //id is parameter value of url  
//     //mongoose coverts string IDS into object Ids automatically unlike before hence advantage 
//     //console.log(req.params)//params is used to obtain and use it
//     const _id = req.params.id //id matches with above

//     try{
//         const user = await findById(_id)
//         if(!user){
//             return res.status(404).send()
//             }
//             res.send(user)

//     } catch(e){
//         res.status(300).send()
//     }
    
//     // User.findById(_id).then((user)=>{
//     //     if(!user){
//     //         return res.status(404).send()
//     //     }

//     //     res.send(user)
//     // }).catch((e)=>{
//     //     res.status(404).send()

//     // })

// })
router.patch('/users/me',auth, async(req,res)=>{//patch used for updating
    const updates = Object.keys(req.body) //keys returns the strings which are a property of the object in parenthesis
    const allowedUpdates = ['name', 'age', 'password','age']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Updates !'})
    }
    
    try{
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true} )//new returns updated data,validation runs validation weather the object needed to update exists or not etc 
        //const user = await User.findById(req.params.id)
        updates.forEach((update)=>req.user[update] = req.body[update])
        
        await req.user.save()
        // if (!user){
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch (e){
        res.status(400).send(e)
    }
})
const upload = multer({
    //dest:'avatars', //destination directory called avatar //avoiding destination stops multer from storing data to the directory and passes it to the function for the function to handle it instead
    limits:{
        fileSize: 1000000
    },
    fileFilter(req, file, cb){//property
        if(!file.originalname.match(/\.(jpg|jpeg|png|JPG)$/)){
            return cb(new Error('Please upload an image'))
        }
        // cb(new Error('File must be a PDF'))
        //cb(undefined, true)
        //cb(undefined, false)
    }
})
router.post('/users/me/avatar',auth , upload.single('avatar'), async(req,res)=>{//upload.single is middleware and we are providing the key avatar to it
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send('done')
} ,(error, req, res, next)=>{//providing another function
    res.status(400).send({error: error.message})
})


router.post('/users/login',async (req,res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch (e){
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async(req, res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()
        res.send()
    }catch (e){
        res.status(500).send()

    }
})

router.post('/users/logoutAll', auth, async(req, res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/users/me', auth, async (req, res)=>{
    try{
        // const user = await User.findByIdAndDelete(req.user._id)//we have access to req.user cause we are using middleware auth
        // if(!user){
        //     return res.status(404).send()
        // }
        await req.user.remove()
        sendGoodbyeEmail(req.user.email, req.user.name)
        res.send(req.user)
  
    }catch(e){
        res.status(500).send(e)
    }
})


module.exports = router