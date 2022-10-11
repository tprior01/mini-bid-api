const express = require('express')
const router = express.Router()
const verifyToken = require('../verifyToken')
const {itemValidation} = require('../validations/validation')
const {Item} = require('../models/Item');
const {Bid} = require('../models/Bid');
const {User} = require('../models/User');
const multer  = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const nodeSchedule = require('node-schedule');

router.post('/sell', upload.single("file"), verifyToken, async(req,res)=>{
    // validation to check user input
    const {error} = itemValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // code to insert data
        const item = Item({
        title: req.body.title,
        description: req.body.description,
        condition: req.body.condition,
        expiresAt: new Date(req.body.expiresAt),
        user:req.user._id,
        file: {
            data: req.file.buffer,
            contentType: req.file.mimetype
          }
    })

    // schedule updates to seller and buyer of item
    nodeSchedule.scheduleJob(item.expiresAt, async function(){
        const winner = await (await Bid.findOne({item:item._id}).sort({price:-1}))
        console.log(winner)
            if (winner) {
                console.log(winner.user)
                await User.findByIdAndUpdate(winner.user, 
                    {$push: {itemsWon: winner.item}},
                    {new: true}).exec()
                await User.findByIdAndUpdate(item.user, 
                    {$push: {itemsSold: item._id}},
                    {new: true}).exec()
            }});
    try {
        const savedItem = await item.save()
        res.send(savedItem)
    } catch(err){
        res.status(400).send({message:err})
    }
})

module.exports = router