import mongoose from 'mongoose'

const productSchema= new mongoose.Schema({
    username : { type: String, required : true},
    password : { type: String, required : true},
    profile : { type: String}    
})

export default mongoose.model("users", productSchema);