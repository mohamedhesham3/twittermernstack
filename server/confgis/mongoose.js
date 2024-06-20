const mongoose=require('mongoose')
require("dotenv").config();

const mongfile= mongoose.connect(process.env.MONGO_SECRET,{
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("Connected to mongoose");
}).catch(err => {
  console.error("Error connecting to MongoDB:", err);
});

module.exports=mongfile