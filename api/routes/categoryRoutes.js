const express= require("express");
const router = express.Router();
const { categoryCtrl } = require("../controllers/categoryControll");
const { authAdmin } = require("../middlewares/auth/authentication");

router.get("/",categoryCtrl.getCategories)
router.post("/",authAdmin,categoryCtrl.addCtegory)
router.delete("/",authAdmin,categoryCtrl.deleteCategory)

module.exports = router;