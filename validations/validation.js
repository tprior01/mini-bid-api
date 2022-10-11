const joi = require('joi')

const registerValidation = (data) => {
    const schemaValidation = joi.object({
        username:   joi.string().required().min(3).max(256).alphanum(),
        email:      joi.string().required().min(6).max(256).email(),
        password:   joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const loginValidation = (data) => {
    const schemaValidation = joi.object({
        email:      joi.string().required().min(6).max(256).email(),
        password:   joi.string().required().min(6).max(1024)
    })
    return schemaValidation.validate(data)
}

const itemValidation = (data) => {
    const schemaValidation = joi.object({
        title:          joi.string().required().min(1).max(256),
        description:    joi.string().required().min(1).max(1024),
        condition:      joi.string().required().valid('New', 'Used'),
        expiresAt:      joi.date().required().greater('now').iso()
    })
    return schemaValidation.validate(data)
}

const bidValidation = (data) => {
    const schemaValidation = joi.object({
        price:  joi.number().integer().required().min(1)
    })
    return schemaValidation.validate(data)
}

module.exports.registerValidation = registerValidation
module.exports.loginValidation = loginValidation
module.exports.itemValidation = itemValidation
module.exports.bidValidation = bidValidation