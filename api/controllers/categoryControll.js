const { genShortId } = require("../helpers/genShortId")
const { CategoryModel } = require("../models/categoryModel")

exports.categoryCtrl = {
    getCategories:async (req, res)=>{
        try{
            let categories=await CategoryModel.find({});
            return res.json(categories)
        }
        catch(err){
            console.log(err)
        }

    },
    addCtegory: async (req, res) => {
        try {
            let category = await CategoryModel.create(req.body)
            category.short_id =await genShortId(100, 10000, CategoryModel)
            await category.save()
            res.json(category)
        }
        catch (err) {
            console.log(err)
        }
    },
    deleteCategory: async (req, res) => {
        try {
            let catShortId=req.query.catShortId
            let resp=await CategoryModel.deleteOne({short_id:catShortId})
            res.json(resp)
        }
        catch(err){
            console.log(err)
        }
    }
}