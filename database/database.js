const mongoose =require('mongoose');
const connectionstring=process.env.mongo_URI
async function ConnectToDatabase(){
    await mongoose.connect(connectionstring)
    console.log("connected to mongoDB")

}

module.exports = ConnectToDatabase;