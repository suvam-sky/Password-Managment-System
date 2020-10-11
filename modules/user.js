const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true,useCreateIndex:true},(err)=>{
    if(!err){
        console.log("mongoDb connected");
    }
    else{
        console.log('error in mongoDb :' + err);
    }
})
var conn = mongoose.connection

var employeeSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    password:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now
    }
})
var userModel = mongoose.model('users',employeeSchema)
module.exports = userModel
