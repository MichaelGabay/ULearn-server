const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
  short_id: String,
  name: String
})
exports.CategoryModel = mongoose.model("categories", categorySchema)