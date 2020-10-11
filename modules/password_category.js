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

var passCatSchema = new mongoose.Schema({
    password_category:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    date:{
        type:Date,
        default:Date.now
    }
})
var passCatModel = mongoose.model('password_category',passCatSchema)
module.exports = passCatModel
