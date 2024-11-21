const mongoose = require('mongoose')

const db_connect = async()=>{
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("Local database connected");
}

module.exports = db_connect