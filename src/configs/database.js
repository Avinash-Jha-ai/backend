const mongoose =require("mongoose");

function connectDb(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("database is connected");
    })
    .catch((err)=>{
        console.log("error connetcting to database ",err);
    })
}

module.exports =connectDb;