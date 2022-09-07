const { systemModel } = require("../models/systemModel")

exports.systemCtrl = {
    updateTheHotCourseOfTheWeek: async (req, res) => {
        try {
            let systemObject = await systemModel.findOne({});
            systemObject.theHotCourseForWeekShortId  = req.body.shortIdCourse;
            await systemObject.save()
            return res.json({msg:"hot course of the week updated"}).status(200)
        }
        catch (err) {
            console.log(err)
        }
    },
    updateCatgeroriesForHomePage: async (req, res) => {
        try {
            let systemObject = await systemModel.findOne({});
            systemObject.catgeroriesForHomePage  = req.body;
            await systemObject.save();
            return res.json({msg:"categories for homem page updated"}).status(200)
        }
        catch (err) {
            console.log(err)
        }
    },
    getHotCourseForWeek: async (req, res) => {
        try {
            let systemObject = await systemModel.findOne({});
            console.log(systemObject)
          
            return res.json({msg:"categories for homem page updated"}).status(200)
        }
        catch (err) {
            console.log(err)
        }
    }
}