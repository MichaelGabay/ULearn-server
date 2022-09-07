const mongoose = require('mongoose')

const systemSchema = new mongoose.Schema({
  theHotCourseForWeekShortId: String,
  catgeroriesForHomePage:[String]
})
exports.systemModel = mongoose.model("systems", systemSchema)