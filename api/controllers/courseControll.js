const { genShortId } = require("../helpers/genShortId");
const { courseModel } = require("../models/courseModel");
const { UserModel } = require("../models/userModel")
const { CategoryModel } = require("../models/categoryModel");
const { courseValid } = require("../validations/courseValidation");
const { systemModel } = require("../models/systemModel");

exports.courseCtrl = {
    addCourse: async (req, res) => {
        try {
            let validation = courseValid.addCourse(req.body)
            if (validation.error) return res.json(validation.error.details)
            let newCourse = await courseModel.create(req.body);
            newCourse.creator_id = req.tokenData.userData._id
            newCourse.short_id = await genShortId(100000, 1000000, courseModel)
            let { name } = await CategoryModel.findOne({ short_id: req.body.categoryShortId }).select("name")
            newCourse.categoryName = name
            await newCourse.save();
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            user.myCourses.push(newCourse.short_id)
            await user.save()
            return res.json(newCourse)
        }
        catch (err) {
            console.log(err)
        }
    },
    deleteCourse: async (req, res) => {
        try {
            let shortId = req.query.shortId;
            let course = await courseModel.findOne({ short_id: shortId })
            if (req.tokenData.userData._id != course.creator_id) {
                return res.json({ msg: "you can't delete course that not your's" })
            }
            await courseModel.deleteOne({ short_id: shortId })
            let user = await UserModel.findOne({ _id: req.tokenData.userData._id })
            user.myCourses = user.myCourses.filter(item => item != shortId);
            await user.save()
            return res.json({ msg: "Course deleted" })
        }
        catch (err) {
            return console.log(err)
        }
    },
    updateCourse: async (req, res) => {
        try {
            let validation = courseValid.addCourse(req.body)
            if (validation.error) return res.json(validation.error.details)
            let shortId = req.query.shortId;
            let category = await CategoryModel.findOne({ short_id: req.body.categoryShortId })
            req.body.categoryName = category.name;
            let resp = await courseModel.updateOne({ short_id: shortId, creator_id: req.tokenData.userData._id }, req.body)
            res.json(resp)
        }
        catch (err) {
            return console.log(err)
        }
    },
    getCourses: async (req, res) => {
        let courses = [];
        try {
            let { catgeroriesForHomePage } = await systemModel.findOne({})
            for (let i = 0; i < catgeroriesForHomePage.length; i++) {
                if (catgeroriesForHomePage[i] == 0) continue
                const coursesOfCategory = await courseModel.find({ categoryShortId: catgeroriesForHomePage[i] }).sort({ _id: -1 }).limit(5).select('img_url name short_id categoryShortId categoryName').lean();
                let object = {
                    categoryName: coursesOfCategory[0]?.categoryName,
                    courses: coursesOfCategory
                }
                if (coursesOfCategory.length > 0) {
                    courses = [...courses, object];
                }
            }
            return res.json(courses)
        }
        catch (err) {
            return console.log(err)
        }

    },
    getCoursByShortId: async (req, res) => {
        try {
            let shortId = req.query.shortId
            let course = await courseModel.findOne({ short_id: shortId }).lean()
            course.lessons.forEach(item => {
                item.FAQ = item.FAQ.reverse();
                item.FAQ.forEach(element => {
                    element.answerAr = element.answerAr.reverse();
                })
            })
            return res.json(course)
        }
        catch (err) {
            return console.log(err)
        }
    },

    addLesson: async (req, res) => {
        try {
            let validation = courseValid.addLesson(req.body)
            if (validation.error) return res.json(validation.error.details)
            let courseShortId = req.query.courseShortId
            let course = await courseModel.findOne({ short_id: courseShortId })
            //cheking if who is sent the information is the creator of the course
            if (req.tokenData.userData._id != course.creator_id) {
                return res.json({ msg: "you can't add leeson to course that not yours" })
            }
            course.lessons.push(req.body)
            course.save()
            res.json({ msg: "lesoon added" })
        }
        catch (err) {
            return console.log(err)
        }
    },
    deleteLesson: async (req, res) => {
        try {
            let courseShortId = req.query.courseShortId
            let lessonId = req.query.lessonId
            let course = await courseModel.findOne({ short_id: courseShortId })
            if (req.tokenData.userData._id != course.creator_id) {
                return res.json({ msg: "you can't delete leeson from course that not yours" })
            }
            course.lessons = course.lessons.filter(item => item._id != lessonId)
            await course.save()
            res.json({ msg: "lesson deleted" })
        }
        catch (err) {
            return console.log(err)
        }
    },
    updateLesson: async (req, res) => {
        try {
            let validation = courseValid.addLesson(req.body)
            if (validation.error) return res.json(validation.error.details)
            let flag = true
            let courseShortId = req.query.courseShortId
            let lessonId = req.query.lessonId
            let course = await courseModel.findOne({ short_id: courseShortId })
            if (req.tokenData.userData._id != course.creator_id) {
                return res.json({ msg: "you can't delete leeson from course that not yours" })
            }
            let data = req.body
            course.lessons.forEach(item => {
                if (item._id == lessonId) {
                    item.name = data.name
                    item.link = data.link
                    item.files_link = data.files_link
                    item.info = data.info
                    flag = false
                }
            })
            await course.save()
            if (flag) {
                return res.status(400).json({ msg: "there is a problem" })
            }
            return res.json({ msg: "lesson updated" })
        }
        catch (err) {
            console.log(err)
        }
    },

    addQToLesson: async (req, res) => {
        let flag = true
        try {
            let validation = courseValid.addQToLesson(req.body)
            if (validation.error) return res.json(validation.error.details)
            let courseShortId = req.query.courseShortId
            let lessonId = req.query.lessonId
            let Q = {
                name: req.tokenData.userData.firstName,
                data: req.body.data,
                userId: req.tokenData.userData._id,
                title: req.body.title,
                date_created: req.body.date_created
            }

            let course = await courseModel.findOne({ short_id: courseShortId })
            if (course) {
                course.lessons.forEach(async (item) => {
                    if (item._id == lessonId) {
                        item.FAQ.push({ Q })
                        flag = false
                        await course.save()
                        let question = item.FAQ[item.FAQ.length - 1];
                        return res.json({ msg: "Q added", question: question })
                    }
                    return
                })
            }
            if (flag) {
                return res.status(400).json({ msg: "there is a problem" })
            }
        }
        catch (err) {
            console.log(err)
        }
    },
    deleteQFromLesson: async (req, res) => {
        let flag = true
        let courseShortId = req.query.courseShortId
        let lessonId = req.query.lessonId
        let QId = req.query.QId
        let FAQAr = []
        try {
            let course = await courseModel.findOne({ short_id: courseShortId })
            course.lessons.forEach(item => {
                if (item._id == lessonId) {
                    FAQAr = item.FAQ
                    return
                }
            })
            FAQAr.forEach((item, i) => {
                if (item._id == QId) {
                    if (item.Q.userId != req.tokenData.userData._id) {
                        return res.json({ msg: "you can't delete this question" })
                    }
                    FAQAr.splice(i, 1)
                    flag = false
                    return
                }
            })
            await course.save()
            if (flag) {
                return res.status(400).json({ msg: "question not found" })
            }
            return res.json({ msg: "Q deleted" })
        }
        catch (err) {
            console.log(err)
        }
    },
    addAnswerToQuestion: async (req, res) => {
        let flag = true
        try {
            let validation = courseValid.addAnsswerToLesson(req.body)
            if (validation.error) return res.json(validation.error.details)
            let courseShortId = req.query.courseShortId
            let lessonId = req.query.lessonId
            let QId = req.query.QId
            let answerObj = {
                name: req.tokenData.userData.firstName,
                data: req.body.data,
                userId: req.tokenData.userData._id,
                date_created: req.body.date_created
            }
            let course = await courseModel.findOne({ short_id: courseShortId })
            course.lessons.forEach(item => {
                if (item._id == lessonId) {
                    item.FAQ.forEach((item => {
                        if (item._id == QId) {
                            item.answerAr.push(answerObj)
                            flag = false
                            return res.json({ msg: "answer added", ansswer: item.answerAr[item.answerAr.length - 1] })
                        }
                    }))
                    return
                }
            })
            await course.save()
            if (flag) {
                return res.status(400).json({ msg: "there is a problem" })
            }

        }
        catch (err) {
            console.log(err)
        }
    },
    deleteAnswerFromQuestion: async (req, res) => {
        try {
            let courseShortId = req.query.courseShortId
            let lessonId = req.query.lessonId
            let QId = req.query.QId
            let AId = req.query.AId
            let indexDel = -1
            let course = await courseModel.findOne({ short_id: courseShortId })
            course.lessons.forEach(item => {
                if (item._id == lessonId) {
                    item.FAQ.forEach((item) => {
                        if (item._id == QId) {
                            item.answerAr.forEach((item, i) => {
                                if (item._id == AId) {
                                    if (item.userId != req.tokenData.userData._id) {
                                        return res.json({ msg: "you can't delete this question" })
                                    }
                                    indexDel = i
                                    return
                                }
                            })
                            item.answerAr.splice(indexDel, 1)
                            return
                        }
                    })
                    return
                }
            })

            if (indexDel === -1) {
                return res.status(400).json({ msg: 'answer not found' })
            }
            await course.save()
            return res.json({ msg: "answer deleted" })
        }
        catch (err) {
            console.log(err)
        }
    },
    searchCourseByNameOrCategory: async (req, res) => {
        try {
            let search = req.query.search
            search = new RegExp(search, 'i');
            let category = await CategoryModel.findOne({ name: search })
            if (category)
                category = category.short_id;
            let data = await courseModel.find({ $or: [{ name: search }, { categoryShortId: category }] }).select("name price short_id img_url").limit(20)
            return res.json(data)
        }
        catch (err) {
            console.log(err)
        }
    },
    getCourseForPage: async (req, res) => {
        try {
            let shortId = req.query.shortId
            let course = await courseModel.findOne({ short_id: shortId }).select("name img_url info price creator_id").lean()
            course.creatorName=await UserModel.findOne({_id:course.creator_id}).select("fullName")
            return res.json(course)
        }
        catch (err) {
            return console.log(err)
        }
    },
    updateLessonOrder: async (req, res) => {
        try {
            let shortId = req.query.shortId
            let course = await courseModel.findOne({ short_id: shortId })
            course.lessons = req.body
            await course.save()
            return res.json({ msg: "sort updated" })
        }
        catch (err) {
            return console.log(err)
        }
    },
    getTheHotCourse: async (req, res) => {
        try {
            let systemObject = await systemModel.findOne({});
            // console.log(systemObject.theHotCourseForWeekShortId)
            let course=await courseModel.findOne({short_id:systemObject.theHotCourseForWeekShortId}).select('img_url name short_id categoryShortId categoryName')
            return res.json(course).status(200)
        }
        catch (err) {
            return console.log(err)
        }
    }
}