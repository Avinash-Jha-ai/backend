const { Router } = require("express");
const authcontroller = require("../controllers/auth.controller");

const router = Router();

router.post("/register", authcontroller.registeruser);
router.post("/login", authcontroller.loginuser);
router


module.exports = router;