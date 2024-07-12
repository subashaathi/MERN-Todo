//Express - npm install express
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

//create an instense of express
const app = express();
app.use(express.json());
app.use(cors());

//Sample in Memory Storage
//let todos = [];

//connecting mongodb
mongoose.connect('mongodb://localhost:27017/mern-app')
.then(() => {
    console.log('MongoDB Connected...')
})
    .catch(err => {
        console.log('MongoDB Connection Failed...');
    })

    
    
//create a Schema

 const todoSchema = new mongoose.Schema({
    title: {
        required:true,
        type: String
    },
    description: String,
 })

 //create a model
 const TodoModel = mongoose.model('Todo',todoSchema);
    
/*define a route
app.get('/', (req, res) => {
    res.send("helloWorld")
})*/

//create a new todo item or route
app.post('/todos',async(req,res) =>{
    const {title,description} = req.body;
    /* newtodo = {
        id:todos.length + 1,
        title,
        description
    };
    todos.push(newtodo);
    console.log(todos)*/
    try{
        const newTodo = new TodoModel({title,description});
        await newTodo.save();
        res.status(201).json(newTodo);
    }
    catch(error){
        console.log(error)
        res.status(500).json({message:error.message})
    } 
})

//get all items
app.get('/todos',async(req,res) =>{
    try {
        const todos = await TodoModel.find();
        res.json(todos);
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})
    }
    
})

//update todo items
app.put('/todos/:id',async(req,res) => {

    try {
            const {title,description} = req.body;
            const id = req.params.id;
            const updatedTodo = await TodoModel.findByIdAndUpdate(
                id,
                {title,description},
                {new:true}
        )
        if(!updatedTodo){
            return res.status(404).json({message:"Todo Not Found"})
        }
        res.json(updatedTodo)
       
    } catch (error) {
        console.log(error)
        res.status(500).json({message:error.message})        
    }
 })

 //delete a todo item
    app.delete('/todos/:id',async(req,res) => {
        try {
            const id = req.params.id;
            await TodoModel.findByIdAndDelete(id);
            res.json({message:"Todo Deleted"})
        } catch (error) {
            console.log(error)
            res.status(500).json({message:error.message}) 
        }
        
    })


//start the server
const port =3000;
app.listen(port, () => {
    console.log(`server started on port ${port}`)
})