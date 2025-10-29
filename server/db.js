const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const ObjectId=Schema.Types.ObjectId;
console.log("connecting to db");

mongoose.connect(process.env.MONGO_URL);

const adminSchema=new Schema({
    name:String,
    email:{type:String, unique:true},
    password:String
})
const userSchema=new Schema({
    name:String,
    email:{type:String,unique:true},
    password:String
})
const userInputSchema=new Schema({
    userId:{type:ObjectId,ref :"users", required:true},
    input:[String]
},
{
    timestamps:true
}
)

const aiQuestionSchema=new Schema({
    userId:{type:ObjectId,ref :"users", required:true},
  output: { type: [String], default: [] }
},
{
    timestamps:true
}
)
const userAnswerSchema=new Schema({
    userId:{type:ObjectId,ref :"users", required:true},
    questionId:{type:ObjectId,ref :"aiquestions",required:true},
    question: { type: String, required: true},
    answer: { type: String, required: true }
},
{
    timestamps:true
}
)
// ✅ done: new schema for parsed reports
const reportSchema = new Schema({
  userId: { type: ObjectId, ref: "users", required: true },
  questionId: { type: ObjectId, ref: "aiquestions", required: true },
  overallScore: String,
  strengths: [String],
  areasToWorkOn: [String],
  communicationSkills: String,
  technicalKnowledge: String,
  quickTips: [String],
  scoresBreakdown: Object,
  answerFeedback: [String],
  lastFeedback: String,
}, { timestamps: true });




const userModel=mongoose.model("users",userSchema);
const adminModel=mongoose.model("admins",adminSchema);
const userInputModel=mongoose.model("userinputs",userInputSchema);
const aiQuestionModel=mongoose.model("aiquestions",aiQuestionSchema);
const userAnswernModel=mongoose.model("useranswers",userAnswerSchema);
const reportModel = mongoose.model("reports", reportSchema);

module.exports={
    userModel,
    adminModel,
    userInputModel,
    aiQuestionModel,
    userAnswernModel,
    reportModel
}