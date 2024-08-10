import mongoose from 'mongoose'

const ToDoListSchema = new mongoose.Schema({
    name : {type : String, require : true},
    time : {type : String, require : true}
})

export default mongoose.model("ToDoList", ToDoListSchema)