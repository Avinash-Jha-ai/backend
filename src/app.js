const cookieParser = require("cookie-parser")
const express =require("express")
const app = express()


app.use(express.json())
app.use(cookieParser())

/**
 * Routes
*/
const authRoutes = require("./routes/auth.route");
app.use("/api/auth",authRoutes);


module.exports = app