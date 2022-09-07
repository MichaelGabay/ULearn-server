const express= require("express");
const router = express.Router();
const { authCtrl } = require("../controllers/authControll");
const { userCtrl } = require("../controllers/userController");
const { authUser } = require("../middlewares/auth/authentication");

router.post('/',authCtrl.signUp)
router.post('/login',authCtrl.login)
router.post('/loginWhithGoogle',authCtrl.loginWhithGoogle)
router.post('/addCourseOrRemoveToCart',authUser,userCtrl.addCourseOrRemoveToCart)
router.delete("/deleteAllFromCart",authUser,userCtrl.deleteAllFromCart)
router.post("/buyOneCourse",authUser,userCtrl.buyOneCourse)
router.post("/buyAllTheCart",authUser,userCtrl.buyAllTheCart)
router.post("/addOrRemoveViewing",authUser,userCtrl.addAndRemoveViewing)
router.get("/getMyCourses",authUser,userCtrl.getMyCourses)
router.get("/getMylearning",authUser,userCtrl.getMylearning)
router.post("/addOrRemoveToWishList",authUser,userCtrl.addOrRemoveToWishList)
router.delete("/deleteAllWishlist",authUser,userCtrl.deleteAllWishlist)
router.get("/getWishList",authUser,userCtrl.getWishList)
router.get("/getMyCart",authUser,userCtrl.getMyCart)
router.get("/getMyInfoAcount",authUser,userCtrl.getMyInfoAcount)
router.put("/editMyInfoAcount",authUser,userCtrl.editMyInfoAcount)
router.get("/checkToken",authUser,userCtrl.checkToken)
module.exports = router;