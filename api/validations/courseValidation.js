const Joi = require("joi")

exports.courseValid = {
    addCourse: reqBody => {
        let validation = Joi.object({
            name: Joi.string().required().min(2).max(100),
            info: Joi.string().max(2500),
            categoryShortId: Joi.string().required(),
            price: Joi.number().required(),
            img_url: Joi.string().max(10000),
            difficulty:Joi.string(),
        })
        return validation.validate(reqBody)
    },
    updateCourse: reqBody => {
        let validation = Joi.object({
            name: Joi.string().required().min(2).max(100),
            info: Joi.string().max(2500),
            categoryShortId: Joi.string().required(),
            price: Joi.number().required(),
            img_url: Joi.string().max(10000)
        })
        return validation.validate(reqBody)
    },
    addLesson: reqBody => {
        let validation = Joi.object({
            name: Joi.string().required().min(2).max(100),
            link: Joi.string().required().max(10000),
            files_link: Joi.string().allow(null, "").max(10000),
            info:Joi.string().max(255).allow(null, "")
        })
        return validation.validate(reqBody)
    },
    addQToLesson: reqBody => {
        let validation = Joi.object({
            data:Joi.string().min(2).max(2000).allow(null, ""),
            title:Joi.string().required().min(2).max(300),
            date_created:Joi.number().required()
        })
        return validation.validate(reqBody)
    },
    addAnsswerToLesson: reqBody => {
        let validation = Joi.object({
            data:Joi.string().min(2).max(2000).required(),
            date_created:Joi.number().required()
        })
        return validation.validate(reqBody)
    }

}