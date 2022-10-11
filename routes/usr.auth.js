const express = require('express')
const router = express.Router()
const {registerValidation, loginValidation} = require('../validations/validation')
const {User} = require('../models/User')
const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')

router.post('/register', async(req,res)=>{
    // validation to check user input
    const {error} = registerValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // validation to check if user exists
    const userExists = await User.findOne({$or: [{email:req.body.email},{username:req.body.username}]})
    if(userExists){
        return res.status(400).send({message:'Username or email already exists'})
    }

    // create hashed representation of password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    // code to insert data
        const DBitem = User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })

    try {
        const savedUser = await DBitem.save()
        res.send(savedUser)
    } catch(err){
        res.status(400).send({message:err})
    }
})

router.post('/login', async(req,res)=>{
    // validation to check user input
    const {error} = loginValidation(req.body)
    if(error){
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // validation to check if user exists
    const user = await User.findOne({email:req.body.email})
    if(!user){
        return res.status(400).send({message:'User does not exists'})
    }

    // validation to check password
    const passwordValidation = await bcryptjs.compare(req.body.password,user.password)
    if(!passwordValidation){
        return res.status(400).send({message:'Password is wrong'})
    }
    // generate an auth-token for your user
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send({'auth-token':token})
})


module.exports = router