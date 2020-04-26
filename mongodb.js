//CRUD create read update delete


// const mongobd = require('mongodb')
// const MongoClient = mongobd.MongoClient //mongoclient gives access to functions which helps performs neccessay operations for crud
// const ObjectID = mongobd.ObjectID

const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// const id = new ObjectID() //new is optional
// console.log(id)
// console.log(id.getTimestamp())

MongoClient.connect(connectionURL, {useNewUrlParser: true, useUnifiedTopology: true}, (error, client) => {
    if (error) {
        return(
        console.log('Unable to connect to database'))
    }
    const db = client.db(databaseName) //db is a refference to store the value in databaseName to use it to further manipulate
                                        //connection to client 


    // db.collection('users').findOne({_id: new ObjectID("5e9ac7914a2b0418143985e8")},(error, user) => {
    //     if(error){
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(users)
    // })

    // db.collection('users').find({age: 27}).toArray((error, users)=>{//to array gets all the elements in the array
    //     console.log(users)
    // })

    // db.collection('users').find({age: 27}).count((error, count)=>{//count gives us the total count 
    //     console.log(count)
    // })

    // db.collection('task').find({_id: new ObjectID("5e9add9ad084912e6096ef18")}).toArray( (error, task) => {
    //     console.log(task)
    // })

    // db.collection('task').find({description: true }).toArray((error, task) => {
    //     console.log(task)
    // })

    //  db.collection('users').updateOne({
    //     _id: new ObjectID("5e9ac5a32282df3c900d5d99")
    // },{
    //     $set:{
    //         name: 'Mike'
    //     }

    // }).then((result)=>{
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection('task').updateMany({
        description: true
    },{
        $set:{
            description: false
        }

    }).then((result)=>{
        console.log(result.modifiedCount)
    }).catch((error) => {
        console.log(error)
    })

    db.collection('users').deleteMany({
        age:27
    }).then((result)=>{
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })


    //hence this is the benefit of using find as find returns and point a cursor to that object. 
    //this can be combined with several functions to get the desired output


    // db.collection('users').insertOne({
    //     _id: id,
    //     name: 'Vikram',
    //     age: 27
    // }, (error, result) =>{
    //     if(error){
    //         return console.log('Unable to insert user')
    //     }
    //     console.log(result.ops)//ops is a funtion with an array of all the documents 

    // })

//     db.collection('users').insertMany([{
//         name:'Jen',
//         age: 28
//     },{
//         name:'Gunther',
//         age:30
//     }], (error, result) =>{
//            if(error){
//                  return console.log('Unable to insert user')
//              }
//              console.log(result.ops)//ops is a funtion with an array of all the documents 
//             })


// db.collection('task').insertMany([{
//     description:'do dance',
//     description: true
// },{
//     description:'do sing',
//     description: true
// },{
//     description:'do crayy',
//     description: true
// }], (error, result) =>{
//         if(error){
//                 return console.log('Unable to insert user')
//             }
//             console.log(result.ops)//ops is a funtion with an array of all the documents 
//         })





    })
 
    
