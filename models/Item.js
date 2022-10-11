const mongoose = require('mongoose')

const itemSchema = new mongoose.Schema({
    title:{
        type:String,
        require:true,
        min:1,
        max:256
    },
    description:{
        type:String,
        require:true,
        min:1,
        max:1024
    },
    condition:{
        type:String,
        require:true,
        enum:['New','Used']
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require:true
    },
    expiresAt:{
        type:Date,
        require:true
    },
    maxBid:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Bid',
        require:true,
        default: undefined
    },
    file: {
        data: Buffer,
        contentType: String
      }
},
{ virtuals: true ,versionKey: false, id: false, timestamps: { createdAt: true, updatedAt: false } })

// function arrayBufferToBase64(file) {
//     console.log('this is what file looks like')
//     var binary = '';
//     var bytes = [].slice.call(new Uint8Array(file));    
//     bytes.forEach((b) => binary += String.fromCharCode(b));    
//     return window.btoa(binary);
// };

itemSchema.virtual('status').get(function () { 
    return this.expiresAt > new Date() ? 'Open to offers' : 'Completed'
});

itemSchema.virtual('timeLeft').get(function () { 
    const total     = Date.parse(this.expiresAt) - Date.parse(new Date())
    if (total < 0) return '00:00:00:00'
    const seconds   = String(Math.floor( (total/1000) % 60 )).padStart(2, '0')
    const minutes   = String(Math.floor( (total/1000/60) % 60 )).padStart(2, '0')
    const hours     = String(Math.floor( (total/(1000*60*60)) % 24 )).padStart(2, '0')
    const days      = Math.floor( total/(1000*60*60*24) )
    return `${days}:${hours}:${minutes}:${seconds}`
});

itemSchema.set('toJSON', { getters: true })
const Item = mongoose.model('Item', itemSchema, 'items');
module.exports = { Item };