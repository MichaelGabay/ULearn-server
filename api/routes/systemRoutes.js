const express= require("express");
const { systemCtrl } = require("../controllers/systemControll");
const { authAdmin } = require("../middlewares/auth/authentication");
const router = express.Router();

router.put("/updateTheCourseOfWeek",authAdmin,systemCtrl.updateTheHotCourseOfTheWeek)
router.put("/updateCatgeroriesForHomePage",authAdmin,systemCtrl.updateCatgeroriesForHomePage)
module.exports = router;