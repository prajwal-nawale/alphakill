// require('dotenv').config();
// const { Router }=require("express");
// const userRouter=Router();

// const jwt=require("jsonwebtoken");
// const { JWT_USER_SECRET }=process.env

// const { userModel,userInputModel }=require("../db");

// userRouter.post("/signup",async (req,res)=>{
//     try{
//     const{name,email,password}=req.body;
//     const user=await userModel.create({
//         name:name,
//         email:email,
//         password:password
//     })
//     await userInputModel.create({
//         userId:user._id,
//         input:[]
//     })
//     res.json({
//         message:"User Signed up"
//     })
//     }catch(err){
//         res.status(403).json({
//             message:"User already exists",
//             message:err.message,
//             success:false
//         })
//     }
// })

// userRouter.post("/signin",async (req,res)=>{
//     const{email,password}=req.body;
//     const userFound=await userModel.findOne({
//         email:email,
//         password:password
//     })
//     if(userFound){
//         const token=jwt.sign({
//             id:userFound._id
//         },JWT_USER_SECRET);
//     res.json({
//         message:"User Signed in",
//         token:token
//     })

//     }else{
        
//         res.status(402).json({
//             message:"User Credentials Invalid"

//         })
//     }

    
// })
// userRouter.post("/addInputVoice",async (req,res)=>{
//     try{
//     const{userId,input}=req.body;
//     const doc=await userInputModel.findOneAndUpdate(
//         { userId },
//         { $push: { input: input } },
//         { new: true}
//     )
//     res.json({
//         message:"User Input Saved"
//     })
//     }catch(err){
//         res.status(403).json({
//             message:"Error saving user input",
//             message:err.message,
//             success:false
//         })
//     }

// })
// userRouter.get("/getInputVoice/:userId",async (req,res)=>{
//     try{
//     const {userId}=req.params;
//     const doc=await userInputModel.findOne({userId:userId}).populate("userId");
//     res.json({
        
//         userInput:doc.input
//     });
//     } catch(err){
//         res.status(403).json({
//             message:"Error fetching user input",
//             message:err.message,
//             success:false
    
//         })

//     }
// })
// module.exports={
//     userRouter:userRouter
// }


// // const OpenAI = require("openai");

// // const openai = new OpenAI({
// //   baseURL: "https://openrouter.ai/api/v1",
// //   apiKey: process.env.OPENROUTER_API_KEY,
// //   defaultHeaders: {
// //     "HTTP-Referer": "http://localhost:3000",
// //     "X-Title": "My App",
// //   },
// // });

// // async function main() {
// //   try {
// //     const completion = await openai.chat.completions.create({
// //       model: "deepseek/deepseek-chat-v3.1:free",
// //       messages: [
// //         { role: "user", content: "What is the meaning of life?" }
// //       ],
// //     });

// //     console.log(completion.choices[0].message);
// //   } catch (err) {
// //     console.error("Error:", err);
// //   }
// // }

// // main();












// require('dotenv').config();
// const { Router }=require("express");
// const userRouter=Router();

// const jwt=require("jsonwebtoken");
// const { JWT_USER_SECRET }=process.env

// const { userModel,userInputModel }=require("../db");

// userRouter.post("/signup",async (req,res)=>{
//     try{
//     const{name,email,password}=req.body;
//     const user=await userModel.create({
//         name:name,
//         email:email,
//         password:password
//     })
//     await userInputModel.create({
//         userId:user._id,
//         input:[]
//     })
//     res.json({
//         message:"User Signed up"
//     })
//     }catch(err){
//         res.status(403).json({
//             message:"User already exists",
//             message:err.message,
//             success:false
//         })
//     }
// })

// userRouter.post("/signin",async (req,res)=>{
//     const{email,password}=req.body;
//     const userFound=await userModel.findOne({
//         email:email,
//         password:password
//     })
//     if(userFound){
//         const token=jwt.sign({
//             id:userFound._id
//         },JWT_USER_SECRET);
//     res.json({
//         message:"User Signed in",
//         token:token
//     })

//     }else{
        
//         res.status(402).json({
//             message:"User Credentials Invalid"

//         })
//     }

    
// })
// userRouter.post("/addInputVoice",async (req,res)=>{
//     try{
//     const{userId,input}=req.body;
//     const doc=await userInputModel.findOneAndUpdate(
//         { userId },
//         { $push: { input: input } },
//         { new: true}
//     )
//     res.json({
//         message:"User Input Saved"
//     })
//     }catch(err){
//         res.status(403).json({
//             message:"Error saving user input",
//             message:err.message,
//             success:false
//         })
//     }

// })
// userRouter.get("/getInputVoice/:userId",async (req,res)=>{
//     try{
//     const {userId}=req.params;
//     const doc=await userInputModel.findOne({userId:userId}).populate("userId");
//     res.json({
        
//         userInput:doc.input
//     });
//     } catch(err){
//         res.status(403).json({
//             message:"Error fetching user input",
//             message:err.message,
//             success:false
    
//         })

//     }
// })

// // New code appended below: Integration for OpenAI processing

// const OpenAI = require("openai");

// // Initialize OpenAI client (once, outside routes for efficiency)
// const openai = new OpenAI({
//   baseURL: "https://openrouter.ai/api/v1",
//   apiKey: process.env.OPENROUTER_API_KEY,
//   defaultHeaders: {
//     "HTTP-Referer": "http://localhost:3000",
//     "X-Title": "My App",
//   },
// });

// // New route: POST /process-input
// // Expects { userId } in request body; fetches inputs from DB, sends to AI, returns response
// userRouter.post("/process-input", async (req, res) => {
//   try {
//     const { userId } = req.body;

//     if (!userId) {
//       return res.status(400).json({ error: "userId is required" });
//     }

//     // Fetch user inputs from MongoDB (latest document)
//     const userInputs = await userInputModel.findOne({ userId }).sort({ createdAt: -1 });

//     if (!userInputs || !userInputs.input.length) {
//       return res.status(404).json({ error: "No inputs found for this user" });
//     }

//     // Combine inputs into a single prompt (you can adjust this logic)
//     const prompt = userInputs.input.join(" "); // Joins array into a string

//     // Call OpenAI API
//     const completion = await openai.chat.completions.create({
//       model: "deepseek/deepseek-chat-v3.1:free",
//       messages: [
//         { role: "user", content: prompt }
//       ],
//     });

//     // Extract and return the AI response
//     const aiResponse = completion.choices[0].message.content;
//     res.json({ aiResponse });
//   } catch (err) {
//     console.error("Error:", err);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

// module.exports={
//     userRouter:userRouter
// }
