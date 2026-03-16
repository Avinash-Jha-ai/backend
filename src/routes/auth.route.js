const { Router } = require("express");
const authcontroller = require("../controllers/auth.controller");
const authMiddleware =require("../middlewares/auth.middleware")
const router = Router();

router.post("/register", authcontroller.registeruser);
router.post("/login", authcontroller.loginuser);
router.get("/get-me",authMiddleware.authUser,authcontroller.getMe);
router.get("/logout",authcontroller.logoutuser);

module.exports = router;