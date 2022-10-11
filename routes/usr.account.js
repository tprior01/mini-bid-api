const express = require('express')
const router = express.Router()
const verifyToken = require('../verifyToken')
const {User} = require('../models/User');
const {Bid} = require('../models/Bid');
const {Item} = require('../models/Bid');


router.get('/items-won', verifyToken, async(req,res)=>{
    const items = await User.findById(req.user._id,{itemsWon:1, _id:0})
    .populate({
        path: "itemsWon",
        model: "Item",
        options: { select: {"user":0, "createdAt":0}},
        populate:{
            path: "maxBid",
            model: "Bid",
            options: { select: {"price":1}},
            populate:{
                path: "user",
                model: "User",
                options: { select: {"username":1}}}
        }})
        res.send(items)    
})

router.get('/items-sold', verifyToken, async(req,res)=>{
    const items = await User.findById(req.user._id,{itemsSold:1, _id:0})
    .populate({
        path: "itemsSold",
        model: "Item",
        options: { select: {"user":0, "createdAt":0}},
        populate:{
            path: "maxBid",
            model: "Bid",
            options: { select: {"price":1}},
            populate:{
                path: "user",
                model: "User",
                options: { select: {"username":1}}}
        }})
        res.send(items)
})

router.get('/bid-history', verifyToken, async(req,res)=>{
        const bids = await Bid.find({user:req.user._id})
        .populate({
            path: "user",
            model: "User",
            options: { select: {username:1}}})
        .populate({
            path: "item",
            model: "Item",
            options: { select: {title:1, consition:1,expiresAt:1}}})
            res.send(bids)    
})

router.get('/:username', verifyToken, async(req,res)=>{
    const user = await User.aggregate([
        {
            $match: {
                username:req.params.username
            }
        },
        {
            $project: {
                username:1
            }
        },
        {
        $lookup: {
            from: 'items',
            localField: '_id',
            foreignField: 'user',
            as: 'itemsForSale',
            pipeline: [
                {$match: { "expiresAt": {$gt: new Date()}}}
            ]
        }
    }])
    res.send(user)    
})

module.exports = router