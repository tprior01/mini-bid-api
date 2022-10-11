const express = require('express')
const router = express.Router()
const {Item} = require('../models/Item');
const {Bid} = require('../models/Bid');
const verifyToken = require('../verifyToken')
const mongoose = require('mongoose')

// Show all items for sale
router.get('/available', async(req,res)=>{
    const items = await Item.find(
        {expiresAt:{ $gt: new Date()}},{__v:0, description:0, createdAt:0})
        .sort({expiry_date: -1})         
        .populate({
            path:"maxBid",
            model:"Bid",
            options: { select: {"price":1}}})             
        .populate({
            path:"user",
            model:"User",
            options: { select: {"username":1}}})
    res.send(items)    
})

// Show all sold items
router.get('/sold', async(req,res)=>{
    const items = await Item.find(
        {expiresAt:{ $lt: new Date()}, maxBid:{ $ne: undefined}},{__v:0, description:0, createdAt:0, status:0, time_left:0})
        .sort({expiry_date: -1})         
        .populate({
            path:"maxBid",
            model:"Bid",
            options: { select: {"price":1}}})             
        .populate({
            path:"user",
            model:"User",
            options: { select: {"username":1}}})
    res.send(items)    
})

// Show all sold items
router.get('/not-sold', async(req,res)=>{
    const items = await Item.find(
        {expiresAt:{ $lt: new Date()}, maxBid:{ $eq: undefined}},{__v:0, description:0, createdAt:0, status:0, time_left:0})
        .sort({expiry_date: -1})         
        .populate({
            path:"maxBid",
            model:"Bid",
            options: { select: {"price":1}}})             
        .populate({
            path:"user",
            model:"User",
            options: { select: {"username":1}}})
    res.send(items)    
})

// Show all new items for sale
router.get('/available/new', async(req,res)=>{
    try {
        const items = await Item.find(
            {expiresAt:{ $gt: new Date()}, condition: {$eq: "New"}},{__v:0, description:0, createdAt:0})
            .sort({expiry_date: -1})         
            .populate({
                path:"maxBid",
                model:"Bid",
                options: { select: {"price":1}}})             
            .populate({
                path:"user",
                model:"User",
                options: { select: {"username":1}}})
        res.send(items)    
    } catch(err){
        res.status(400).send({message:err})
    }
})

// Show all used items for sale
router.get('/available/used', async(req,res)=>{
    const items = await Item.find(
        {expiresAt:{ $gt: new Date()}, condition: {$eq: "Used"}},{__v:0, description:0, createdAt:0})
        .sort({expiry_date: -1})         
        .populate({
            path:"maxBid",
            model:"Bid",
            options: { select: {"price":1}}})             
        .populate({
            path:"user",
            model:"User",
            options: { select: {"username":1}}})
    res.send(items)    
})

// Show item by ID
router.get('/:itemId', async(req,res)=>{
    // validation to check ObjectID is valid
    if (!mongoose.isValidObjectId(req.params.itemId)) {
        return res.status(400).send({message:'item not found'})
    } 
    const item = await Item
    .findById(req.params.itemId, {createdAt:0})
    .populate({
        path:"maxBid",
        model:"Bid",
        options: { select: {"price":1}}})                     
    .populate({
        path:"user",
        model:"User",
        options: { select: {"username":1}}})   
    if(!item) {
        return res.status(400).send({message:'item not found'})
    } 
    res.send(item)    
})

// Show item bid history
router.get('/:itemId/bid-history', verifyToken, async(req,res)=>{
    // validation to check ObjectID is valid
    if (!mongoose.isValidObjectId(req.params.itemId)) {
        return res.status(400).send({message:'item not found'})
    }
    const bids = await Bid.find({item:req.params.itemId},{_id:0, item:0,__v:0, user:0})
    res.send(bids)    
})

module.exports = router