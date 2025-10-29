require('dotenv').config();
const express=require('express');
const mongoose=require('mongoose');
const cors =require("cors");

const { userRouter }=require("./routes/user");
const { adminRouter } =require('./routes/admin');

const app=express();
app.use(cors());
app.use(express.json());

app.use("/v1/user",userRouter);
app.use("/v1/admin",adminRouter);

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(3000);
    console.log("server started at port 3000");

}
main();

