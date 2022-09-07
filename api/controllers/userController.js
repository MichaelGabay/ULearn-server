const e = require("express");
const { courseModel } = require("../models/courseModel")
const { UserModel } = require("../models/userModel");
const { userValid } = require("../validations/userValidation");

exports.userCtrl = {
    addCourseOrRemoveToCart: async (req, res) => {
        let courseShortId = req.query.courseShortId
        let flag = false;
        try {
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id }, { password: 0 })
            user.myLearning.forEach(item => {
                if (item.ShortIdCourse == courseShortId) {
                    flag = true
                    return
                }
            })
            if (flag) return res.status(400).json({ msg: "this course already yours" })

            if (user.myCart.includes(courseShortId)) {
                user.myCart = user.myCart.filter(item => item != courseShortId)
            }
            else {
                user.myCart.push(courseShortId)
            }
            await user.save()
            let allMyCart = await courseModel.find({ short_id: user.myCart }).select("name short_id img_url price categoryName")
            res.json({ msg: "cart updated",myCart:allMyCart})
        }
        catch (err) {
            console.log(err)
        }

    },
    deleteFromCart: async (req, res) => {
        try {
            let courseShortId = req.query.courseShortId
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            user.myCart = user.myCart.filter(item => item != courseShortId)
            await user.save()
            res.json({ msg: "course deleted" })
        }
        catch (err) {
            console.log(err)
        }
    },
    deleteAllFromCart: async (req, res) => {
        try {
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            if (user.myCart.length === 0) {
                return res.status(400).json({ msg: 'cart already empty' })
            }

            user.myCart = [];
            user.save()
            return res.json({ msg: "All courses in cart deleted" })

        }
        catch (err) {
            console.log(err)
        }
    },
    buyOneCourse: async (req, res) => {
        let flag = false
        try {
            let shortId = req.query.shortId
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            let course = await courseModel.findOne({ short_id: shortId })
            let courseObj = {
                ShortIdCourse: shortId,
                lastLessonViews: ""
            }
            user.myLearning.forEach(item => {
                if (item.ShortIdCourse == shortId) {
                    flag = true
                    return
                }
            })
            if (flag) return res.status(400).json({ msg: "this course already your's" })
            user.myLearning.push(courseObj)
            user.myCart = user.myCart.filter(item => item != shortId)
            course.subscribes_users_id.push(user._id)
            user.myCart = user.myCart.filter(item => item != shortId)
            user.save()
            course.save()
            res.json({ msg: `${course.name} course is Bought` })
        }
        catch (err) {
            console.log(err)
        }
    },
    buyAllTheCart: async (req, res) => {
        try {
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            let courseObj = {}
            let course
            if (user.myCart.length == 0) return res.json({ msg: "the cart is empty" })
            user.myCart.forEach(async (item) => {
                courseObj = {
                    ShortIdCourse: item,
                    lastLessonViews: ""
                }
                user.myLearning.push(courseObj)
                course = await courseModel.findOne({ short_id: item })
                course.subscribes_users_id.push(user._id)
                course.save()
            })
            user.myCart = []
            user.save()
            return res.json({ msg: "buying all the cart" })
        }
        catch (err) {
            console.log(err)
        }
    },
    addAndRemoveViewing: async (req, res) => {
        let link
        try {
            let coursShortId = req.query.coursShortId
            let lessonId = req.query.lessonId
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            let course = await courseModel.findOne({ short_id: coursShortId })
            //adds the id of viewer in lesson on course
            course.lessons.forEach(item => {
                if (item._id == lessonId) {
                    if (!item.views_id.includes(req.tokenData.userData._id)) {
                        item.views_id.push(req.tokenData.userData._id)
                    }
                    link = item.link
                }
            })
            await course.save()
            //adds the id of lesson on myLerning at lessonsViewsId in user
            user.myLearning.forEach(item => {
                if (item.ShortIdCourse == coursShortId) {
                    if (item.lessonsViewsId.includes(lessonId)) {
                        item.lessonsViewsId = item.lessonsViewsId.filter(item => item != lessonId)
                    }
                    else {
                        item.lessonsViewsId.push(lessonId)
                    }
                    //update the link of the last lesson
                    item.lastLessonViews = link
                    return
                }
            })
            await user.save()
            return res.json({ msg: "view updated" })
        }
        catch (err) {
            console.log(err)
        }
    },
    getMyCourses: async (req, res) => {
        try {
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            let courses = await courseModel.find({ short_id: user.myCourses }).select("short_id img_url name").sort({_id:-1})
            res.json(courses)
        }
        catch (err) {
            console.log(err)
        }
    },
    getMylearning: async (req, res) => {
        try {
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            let coursShortIdAr = user.myLearning.map(item => {
                return item.ShortIdCourse
            })
            let courses = await courseModel.find({ short_id: coursShortIdAr }).select("short_id img_url name")
            res.json(courses)
        }
        catch (err) {
            console.log(err)
        }
    },
    addOrRemoveToWishList: async (req, res) => {
        try {
            let coursShortId = req.query.coursShortId
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            if (user.wishlist.includes(coursShortId)) {
                user.wishlist = user.wishlist.filter(item => item != coursShortId)
            }
            else {
                user.wishlist.push(coursShortId)
            }
            await user.save()
            let wishList = await courseModel.find({ short_id: user.wishlist }).select("name short_id img_url price categoryName info")
            return res.json({ msg: "wishList updated",wishList})
        }
        catch (err) {
            console.log(err)
        }
    },
    deleteAllWishlist: async (req, res) => {
        try {
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            if (user.wishlist.length == 0) return res.json({ msg: "the wishlist is alrady empty" })
            user.wishlist = []
            await user.save()
            return res.json({ msg: "All courses in wishList deleted" })
        }
        catch (err) {
            console.log(err)
        }
    },
    getWishList: async (req, res) => {
        try {
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            let wishList = await courseModel.find({ short_id: user.wishlist }).select("name short_id img_url price categoryName info")
            return res.json(wishList)
        }
        catch (err) {
            console.log(err)
        }
    },
    getViewsIdLessons: async (req, res) => {
        let shortId = req.query.shortId
        let viewsAr
        try {
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            user.myLearning.forEach(item => {
                if (item.ShortIdCourse == shortId) {
                    viewsAr = item.lessonsViewsId
                    return
                }
            })
            return res.json(viewsAr)
        }
        catch (err) {
            console.log(err)
        }
    },
    getMyCart: async (req, res) => {
        try {
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            let myCart = await courseModel.find({ short_id: user.myCart }).select("name short_id img_url price categoryName")
            return res.json(myCart)
        }
        catch (err) {
            console.log(err)
        }
    },
    getMyInfoAcount: async (req, res) => {
        try {
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id }).select("fullName email phone imgProfile myLearning")
            res.json(user)
        }
        catch (err) {
            console.log(err)
        }
    },
    editMyInfoAcount: async (req, res) => {
        try {
            let validation = userValid.editMyInfoAcount(req.body)
            if (validation.error) return res.json(validation.error.details)
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            let email=await UserModel.findOne({email:req.body.email});
            if(email &&email.email!=user.email){
                return res.json({msg:"email allrady taken",status:false})
            }
            let resp = await UserModel.updateOne({ _id: req.tokenData.userData._id }, req.body)
            res.json(resp)
        }
        catch (err) {
            console.log(err)
        }
    },
    checkToken: async (req, res) => {
        try {
            res.json({status:true,role:req.tokenData.userData.role})
        }
        catch (err) {
            console.log(err)
        }
    }

}