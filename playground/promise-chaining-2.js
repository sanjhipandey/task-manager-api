require('../src/db/mongoose')
const Tasks = require('../src/models/task')


// Tasks.findByIdAndDelete('5e9c143888e82d47542e5370').then((task)=>{
//     console.log(task)
//     return Tasks.countDocuments({completed:false})
// }).then((task) =>{
//     console.log(task)
// }).catch((er)=>{
//     console.log(er)
// })


const findIdAndDelete = async (id, comp) =>{
    const task = await Tasks.findByIdAndDelete(id)
    const totalTask = await Tasks.countDocuments(comp)
    return totalTask

}

findIdAndDelete('5e9c143888e82d47542e5370', false).then((totalTask)=>{
    console.log(totalTask)
}).catch((e)=>{
    console.log(e)
})