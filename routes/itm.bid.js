const express = require('express')
const router = express.Router()
const {Item} = require('../models/Item');
const {Bid} = require('../models/Bid');
const verifyToken = require('../verifyToken')
const {bidValidation} = require('../validations/validation')
const mongoose = require('mongoose');


router.post('/:itemId/bid', verifyToken, async(req,res)=>{
    // validation to check user input
    const {error} = bidValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // validation to check ObjectID is valid
    if (!mongoose.isValidObjectId(req.params.itemId)) {
        return res.status(400).send({message:'item not found'})
    }

    // validations to check bid
        const item = await Item.findById(req.params.itemId).populate("maxBid")
        if(!item) {
            return res.status(400).send({message:'item not found'})
        } 
        else if(item.user == req.user._id) {
            return res.status(400).send({message:'bid cannot be for own item'})
        } 
        else if (item.expiresAt < new Date()) {
            return res.status(400).send({message:'bid must be for active auction'})
        } 
        else if (item.maxBid != undefined && item.maxBid.price >= req.body.price) {
            return res.status(400).send({message:'bid must be greater than max'})
        }
        
    
    // code to insert data
        const bid = new Bid({
        price: req.body.price,
        item: req.params.itemId,
        user:req.user._id
    })

    // save bid to database and add bid id to item's max_bid field
    try {
        await bid.save()
        const savedBid = await Bid.findOne({item:req.params.itemId}).sort({price:-1})
        Item.findByIdAndUpdate(req.params.itemId,{maxBid: bid._id}).exec()
        res.send(savedBid)
    } catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router