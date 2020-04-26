const express = require('express')
const router = new express.Router()
const Tasks = require('../models/task')
const auth = require('../middleware/auth')


// GET /tasks?completed=true //FILTERING
//GET /tasks?limit //PAGINATION
//GET /tasks/sortby=createdAt_asc //SORTING parameter seperated by a sepecial char(_,: etc) and followed by asc or dsc 
router.get('/tasks',auth,async(req, res) =>{
    const match ={}
    const sort = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    
    try {
       // const task = await Tasks.find({owner: req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit:parseInt(req.query.limit),//limits two output
                skip:parseInt(req.query.skip),
                sort
                // sort:{
                //     //createdAt: -1 //decending is -1 and ascending is 1
                //     completed:1
                // }
            }
        }).execPopulate()
        res.send(req.user.tasks)
    }catch(e){
        res.status(500).send()
    }
    // Tasks.find({}).then((task)=>{
    //     res.send(task)
    // }).catch((e)=>{
    //     res.status(500).send()
    // })
})

router.post('/tasks',auth ,async(req, res) =>{


    //const task = new Tasks(req.body)

    const task = new Tasks({
        ...req.body,
        owner: req.user._id

    })
    try {
       await task.save()
       res.status(201).send(task)
    } catch (e){
        res.status(400).send(e)

    }

    // task.save().then(()=>{
    //     res.status(201).send(task)
    // }).catch((e)=>{
    //     res.status(400).send(e)
    // })
})

router.get('/tasks/:id',auth, async (req, res)=>{
    const _id = req.params.id

    try{
        //const task = await Tasks.findById(_id)
        const task = await Tasks.findById({_id, owner:req.user_id})
        if(!task){
                return res.status(500).send()
            }
        res.send(task)

    }catch(e){
        res.send(500).send()

    }
    // Tasks.findById(_id).then((task) =>{
    //     if(!task){
    //         return res.status(500).send()
    //     }
    //     res.send(task)
    // }).catch((e)=>{
    //     res.send(500).send()
    // })
})




router.patch('/tasks/:id',auth, async (req, res)=>{
    const updates = Object.keys(req.body) //keys returns the strings which are a property of the object in parenthesis
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid Updates !'})
    }
    
    try{
        //const task = await Tasks.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true} )//new returns updated data,validation runs validation weather the object needed to update exists or not etc 
        const task = await Tasks.findById({_id:req.params.id,owner: req.user._id})
        updates.forEach((update)=>task[update] = req.body[update])
        
        await task.save()

        
        if (!task){
            return res.status(404).send()
        }

        res.send(task)
    } catch (e){
        res.status(400).send(e)
    }


})


router.delete('/tasks/:id',auth, async(req,res)=>{
    try{

        //const task = await Tasks.findByIdAndDelete(req.params.id)
        const task = await Tasks.findOneAndDelete({_id:req.params.id, owner:req.user._id})
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }catch(e){
        res.status(500).send()
    }
})

module.exports=router