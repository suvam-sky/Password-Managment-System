const mongoose = require('mongoose');
var mongoosePagination = require('mongoose-paginate')
const { schema } = require('./user');
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true,useCreateIndex:true},(err)=>{
    if(!err){
        console.log("mongoDb connected");
    }
    else{
        console.log('error in mongoDb :' + err);
    }
})
var conn = mongoose.connection

var passSchema = new mongoose.Schema({
    password_category:{
        type:String,
        required:true,
        
    },
    project_name:{
        type:String,
        required:true,
        
    },
    password_detail:{
        type:String,
        required:true,
        
    },
    date:{
        type:Date,
        default:Date.now
    }
})
passSchema.plugin(mongoosePagination)
var passModel = mongoose.model('password_dateils',passSchema)
module.exports = passModel
