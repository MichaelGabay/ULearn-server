const {mongoUserName,mongoPassword}=require('../../config/secret.js')
const mongoose=require('mongoose')
mongoose.connect(`mongodb+srv://${mongoUserName}:${mongoPassword}@cluster0.p5nuc.mongodb.net/udemi`)