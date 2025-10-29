const mongoose=require("mongoose");
require('dotenv').config();
const { Router }=require("express");
const userRouter=Router();
const OpenAI = require("openai");

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "My App",
  },
});





const jwt=require("jsonwebtoken");
const { JWT_USER_SECRET }=process.env
const  { userMiddleware }=require("../middleware/user");
const aiModel="deepseek/deepseek-chat-v3.1:free";

const { userModel,userInputModel,aiQuestionModel,userAnswernModel,reportModel }=require("../db");

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
//     await aiQuestionModel.create({
//         userId:user._id,
//         output:[]
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
        
//         res.status(401).json({
//             message:"User Credentials Invalid"

//         })
//     }

    
// })

userRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User already exists with this email",
        success: false
      });
    }
    
    const user = await userModel.create({
      name: name,
      email: email,
      password: password
    });
    
    await userInputModel.create({
      userId: user._id,
      input: []
    });
    
    await aiQuestionModel.create({
      userId: user._id,
      output: []
    });
    
    res.json({
      message: "User registered successfully",
      success: true,
      userId: user._id
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({
      message: "Internal server error during signup",
      error: err.message,
      success: false
    });
  }
});

userRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        success: false
      });
    }
    
    const userFound = await userModel.findOne({ email, password });
    
    if (userFound) {
      const token = jwt.sign(
        { id: userFound._id },
        JWT_USER_SECRET,
        { expiresIn: '24h' }
      );
      
      res.json({
        message: "User signed in successfully",
        token: token,
        userId: userFound._id,
        name: userFound.name,
        success: true
      });
    } else {
      res.status(401).json({
        message: "Invalid email or password",
        success: false
      });
    }
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({
      message: "Internal server error during signin",
      error: err.message,
      success: false
    });
  }
});


userRouter.post("/addInputSkill",userMiddleware,async (req,res)=>{
    try{
    const{userId,input}=req.body;
    const doc=await userInputModel.findOneAndUpdate(
        { userId },
        { $push: { input: input } },
        { new: true,upsert:true}
    )
    res.json({
        message:"User Input Saved"
    })
    }catch(err){
        res.status(403).json({
            message:"Error saving user input",
            message:err.message,
            success:false
        })
    }

})
userRouter.post("/aiQuestionGeneration",userMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }
    const userInputs = await userInputModel.findOne({ userId }).sort({ createdAt: -1 });

    if (!userInputs || !userInputs.input.length) {
      return res.status(404).json({ error: "No inputs found for this user" });
    }

    const prompt = `You are an interviewer. You will only ask exactly 10 questions and nothing else. The first 3 questions should be very basic, the next 4 questions should be medium-level, and the last 3 questions should be business case–related. Do not provide answers, hints, or explanations—only ask the questions one by one. ${userInputs.input.join(" ")}`;
    const completion = await openai.chat.completions.create({
      model: aiModel,
      messages: [
        { role: "user", content: prompt }
      ],
    });

    const aiResponse = completion.choices[0].message.content;
    const questionsArray = aiResponse.split("\n\n").map(q => q.replace(/^\d+\.\s*/, ""));
    await aiQuestionModel.findOneAndUpdate(
        { userId },
        { output:questionsArray  },
        {new:true, upsert:true}
    )
    res.json({ Message: "Questions generation complete" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.get("/getQuestions/:userId/:index",userMiddleware,async(req,res)=>{
    const{ userId, index }=req.params;
    const questionArray=await aiQuestionModel.findOne({ userId: new mongoose.Types.ObjectId(userId) });
    if(!questionArray||!questionArray.output.length){
        return res.status(404).json({
            message:"No questions found for this user"
        })
    }
    const question=questionArray.output[index];
    if(!question){
        return res.status(404).json({
            message:"No more questions"
        })
    }
    res.json({
        questionId:questionArray._id,
        question
    })
});

userRouter.post("/submitAnswer",userMiddleware,async(req,res)=>{
    const{userId,questionId,index,answer}=req.body;
    const questionArray=await aiQuestionModel.findById(questionId);
    if(!questionArray){
        return res.status(404).json({
            message:"Question not found"
        })
    }
    const question=questionArray.output[index];
    await userAnswernModel.create({
        userId:userId,
        questionId:questionId,
        question:question,
        answer:answer
    })
    res.json({
        message:"Answer submitted",
        savedAnswer:answer
    })
})
userRouter.post("/generateReport",userMiddleware, async (req, res) => {
  try {
    const { questionId,userId } = req.body;

    // Fetch all answers for the given questionId
    const allAnswers = await userAnswernModel.find({
      questionId: new mongoose.Types.ObjectId(questionId),
    });

    if (!allAnswers || allAnswers.length === 0) {
      return res.status(404).json({
        message: "No answers found for this question set",
      });
    }

    // Format answers nicely for the prompt
    const answersText = allAnswers
      .map((ans, idx) => `${idx + 1}. Q: ${ans.question}\n   A: ${ans.answer}`)
      .join("\n\n");

    const prompt = `
Analyze these interview answers like a experienced developer giving friendly feedback but strict to a junior colleague. The user spoke their answers, so ignore small grammar issues from voice transcription.

Provide your response using exactly this format with #### between sections:

Overall Score: [number between 0-100]
####
Strengths:
- [Strength 1 with specific example]
- [Strength 2 with specific example]
- [Strength 3 with specific example]
####
Areas to Work On:
- [Area 1 with practical suggestion]
- [Area 2 with practical suggestion]
- [Area 3 with practical suggestion]
####
Communication Skills:
[Straightforward assessment in casual language]
####
Technical Knowledge:
[Honest evaluation of what they know and what's missing]
####
Quick Tips for Next Time:
1. [Actionable tip 1]
2. [Actionable tip 2] 
3. [Actionable tip 3]
####
Scores Breakdown:
Clarity: [score]/10
Relevance: [score]/10
Depth: [score]/10
Confidence: [score]/10
Overall: [score]/10
####
Answer Feedback:
Q1: [question text]
F: [Specific feedback for this answer]
--
Q2: [question text] 
F: [Specific feedback for this answer]
--
[Continue for all questions]
####
Last feedback must be very honest and harsh if he did well apreciate but if he tried to make irrelevent answers be harsh
Here are the questions and answers to analyze:
${answersText}

Remember: Talk like a real person, not a corporate robot. Be helpful but honest.
`;

    const completion = await openai.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:free",
      messages: [{ role: "user", content: prompt }],
        max_tokens: 1500
    });

    const aiResponse = completion.choices[0].message.content;

    const parsedReport=parseReport(aiResponse);
    const {
  overallScore,
  strengths,
  areasToWorkOn,
  communicationSkills,
  technicalKnowledge,
  quickTips,
  scoresBreakdown,
  answerFeedback,
  lastFeedback
} = parsedReport;


    await reportModel.create({
        userId,
        questionId,
        overallScore,
        strengths,
        areasToWorkOn,
        communicationSkills,
        technicalKnowledge,
        quickTips,
        scoresBreakdown,
        answerFeedback,
        lastFeedback
    })

    res.json({
        message:"Report Generated",
        report: parsedReport,
    });
  } catch (err) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
// ✅ done: fetch report from DB
userRouter.get("/getReport/:userId/:questionId", async (req, res) => {
  try {
    const { userId, questionId } = req.params;

    const report = await reportModel.findOne({
      userId,
      questionId
    });

    if (!report) {
      return res.status(404).json({ message: "Report not found" });
    }

    res.json({
      message: "Report fetched successfully",
      report
    });

  } catch (err) {
    console.error("Error fetching report:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

userRouter.get("/getInputVoice/:userId",userMiddleware,async (req,res)=>{
    try{
    const {userId}=req.params;
    const doc=await userInputModel.findOne({userId:userId}).populate("userId");
    res.json({
        
        userInput:doc.input
    });
    } catch(err){
        res.status(403).json({
            message:"Error fetching user input",
            message:err.message,
            success:false
    
        })

    }
})

// ✅ done: helper function to parse ####-separated AI response
function parseReport(aiResponse) {
  const sections = aiResponse.split("####").map(s => s.trim());

  const toArray = (text) => {
    if (!text) return [];
    return text
      .split("\n")
      .map(line => line.replace(/^[-\d\.\s]+/, "").trim()) // remove bullets/numbers
      .filter(Boolean);
  };

  return {
    overallScore: sections[0] || "",
    strengths: toArray(sections[1]),
    areasToWorkOn: toArray(sections[2]),
    communicationSkills: sections[3] || "",
    technicalKnowledge: sections[4] || "",
    quickTips: toArray(sections[5]),
    scoresBreakdown: parseScores(sections[6]),
    answerFeedback: toArray(sections[7]),
    lastFeedback: sections[8] || ""
  };
}

// helper to parse scores neatly
function parseScores(text) {
  if (!text) return {};
  const lines = text.split("\n");
  const obj = {};
  lines.forEach(line => {
    const [key, val] = line.split(":");
    if (key && val) obj[key.trim()] = val.trim();
  });
  return obj;
}


module.exports={
    userRouter:userRouter
}
