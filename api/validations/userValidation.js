const Joi = require("joi")

exports.userValid = {
    editMyInfoAcount: reqBody => {
        let validation = Joi.object({
            fullName: {
                firstName: Joi.string().required().min(2).max(20),  
                lastName: Joi.string().required().min(2).max(20)
            },
            email: Joi.string().required().email(),
            phone: Joi.string().allow(null, "").min(6).max(20),
            imgProfile:Joi.string().allow(null,"").max(2500)
        })
        return validation.validate(reqBody)
    },
}