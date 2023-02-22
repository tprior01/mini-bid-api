const express = require('express')
const cors = require('cors')

const app = express()
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

require('dotenv/config')
app.use(bodyParser.json())
app.use(cors())

const getRoute = require('./routes/itm.get')
const sellRoute = require('./routes/itm.sell')
const bidRoute = require('./routes/itm.bid')
const authRoute = require('./routes/usr.auth')
const accountRoute = require('./routes/usr.account')


app.use('/itm',getRoute)
app.use('/itm',sellRoute)
app.use('/itm',bidRoute)
app.use('/usr',authRoute)
app.use('/usr',accountRoute)

mongoose.connect(process.env.DB_CONNECTOR, ()=>{
    console.log('DB is connected')
})

app.listen(process.env.PORT, ()=>{
    console.log('Server is running')
})