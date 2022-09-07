const Joi = require("joi")

exports.authValid = {
    signUp: reqBody => {
        let validation = Joi.object({
            fullName: {
                firstName: Joi.string().required().min(2).max(20),
                lastName: Joi.string().required().min(2).max(20)
            },
            email: Joi.string().required().email(),
            password: Joi.string().required().min(5).max(20),
            phone: Joi.string().allow(null, "").min(6).max(20)
        })
        return validation.validate(reqBody)
    },
    login: reqBody => {
        let validation = Joi.object({
            email:Joi.string().required().email(),
            password:Joi.string().required().min(5).max(20)
        })
        return validation.validate(reqBody)
    }
}