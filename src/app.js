const cookieParser = require("cookie-parser")
const cors =require("cors")
const express =require("express")
const app = express()


app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
/**
 * Routes
*/
const authRoutes = require("./routes/auth.route");
app.use("/api/auth",authRoutes);


module.exports = app