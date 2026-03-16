require("dotenv").config()
const app = require("./src/app");
const connectDb = require("./src/configs/database");

connectDb();
app.listen(3000, () => {
    console.log("server is running on port 3000");
});