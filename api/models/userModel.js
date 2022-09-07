const mongoose = require('mongoose')

let courseObj = {
    ShortIdCourse: String,
    lastLessonViews: String,
    lessonsViewsId:[String]
}
const userSchema = new mongoose.Schema({
    fullName: { firstName: String, lastName: String },
    email: String,
    password: String,
    phone: String,
    imgProfile: String,
    wishlist:[String],
    role: {
        type: String,
        default: "user"
    },
    date: {
        type: Date,
        default: Date.now()
    },
    myLearning: [courseObj],
    myCourses:[String],
    isBan:{
        type:Boolean,
        default:false
    },  
    myCart:[String]
 
})
exports.UserModel = mongoose.model("users", userSchema)