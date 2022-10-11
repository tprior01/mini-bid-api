const mongoose = require('mongoose')

const bidSchema = new mongoose.Schema({
    price:{
        type:Number,
        require:true,
        min:1
    },
    item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
        require:true

    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require:true

    }
},
{ virtuals:true, versionKey: false, id: false, timestamps: { createdAt: true, updatedAt: false }})

bidSchema.virtual('priceString').get(function () { 
    return "£" + (this.price/100).toFixed(2)
});

bidSchema.set('toJSON', { getters: true })
const Bid = mongoose.model('Bid', bidSchema, 'bids');
module.exports = { Bid };