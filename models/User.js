const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true,
        min:3,
        max:256
    },
    email:{
        type:String,
        require:true,
        min:6,
        max:256,
        set: s => s.toLowerCase()
    },
    password:{
        type:String,
        require:true,
        min:6,
        max:1024        
    },
    itemsWon:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item',
        default:[],
        require:true
    }],
    itemsSold:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Item',
        default:[],
        require:true
    }],
},
{ virtuals: true ,versionKey: false, id: false, timestamps: { createdAt: true, updatedAt: false } })

const User = mongoose.model('User',userSchema, 'users')
module.exports = { User };