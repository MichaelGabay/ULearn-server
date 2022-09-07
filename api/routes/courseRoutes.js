const express= require("express");
const router = express.Router();

const { courseCtrl } = require("../controllers/courseControll");
const { authUser } = require("../middlewares/auth/authentication");

router.get("/",courseCtrl.getCourses)
router.get("/course",authUser,courseCtrl.getCoursByShortId)
router.get("/coursePage",courseCtrl.getCourseForPage)
router.post("/addCourse",authUser,courseCtrl.addCourse)
router.post("/addLesson",authUser,courseCtrl.addLesson)
router.put("/updateCourse",authUser,courseCtrl.updateCourse)
router.put("/updateLesson",authUser,courseCtrl.updateLesson)
router.delete("/deleteLesson",authUser,courseCtrl.deleteLesson)
router.delete("/deleteCourse",authUser,courseCtrl.deleteCourse)
router.post("/addQToLesson",authUser,courseCtrl.addQToLesson)
router.delete("/deleteQLesson",authUser,courseCtrl.deleteQFromLesson)
router.post("/addAnswerToQuestion",authUser,courseCtrl.addAnswerToQuestion)
router.delete("/deleteAnswerFromQuestion",authUser,courseCtrl.deleteAnswerFromQuestion)
router.get("/search",courseCtrl.searchCourseByNameOrCategory)
router.post("/updateOrder",authUser,courseCtrl.updateLessonOrder)
router.get("/getTheHotCourse",courseCtrl.getTheHotCourse)
module.exports = router;