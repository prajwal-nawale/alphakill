const express = require("express");
const { adminModel, userModel, userInputModel, aiQuestionModel, userAnswernModel, reportModel } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const  { adminMiddleware }=require("../middleware/admin");
const adminRouter = express.Router();
const { JWT_ADMIN_SECRET } = process.env;


/* -------------------- 🧾 ADMIN SIGNUP -------------------- */
adminRouter.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await adminModel.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Admin already exists", success: false });
    }

    const admin = await adminModel.create({ name, email, password });

    res.json({ message: "Admin created successfully", success: true, adminId: admin._id });
  } catch (err) {
    console.error("Admin signup error:", err);
    res.status(500).json({ message: "Error creating admin", error: err.message });
  }
});

/* -------------------- 🔑 ADMIN SIGNIN -------------------- */
adminRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminModel.findOne({ email, password });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials", success: false });
    }

    const token = jwt.sign({ id: admin._id }, JWT_ADMIN_SECRET, { expiresIn: "24h" });

    res.json({
      message: "Admin signed in successfully",
      token,
      adminId: admin._id,
      success: true,
    });
  } catch (err) {
    console.error("Admin signin error:", err);
    res.status(500).json({ message: "Error signing in", error: err.message });
  }
});

/* -------------------- 🧍‍♂️ GET ALL USERS -------------------- */
adminRouter.get("/users", adminMiddleware, async (req, res) => {
  try {
    const users = await userModel.find().select("-password");
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users", error: err.message });
  }
});

/* -------------------- ❌ DELETE USER + RELATED DATA -------------------- */
adminRouter.delete("/deleteUser/:userId", adminMiddleware, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Delete all linked data
    const deleteResults = await Promise.all([
      userModel.deleteOne({ _id: userId }),
      userInputModel.deleteMany({ userId }),
      aiQuestionModel.deleteMany({ userId }),
      userAnswernModel.deleteMany({ userId }),
      reportModel.deleteMany({ userId }),
    ]);

    res.json({
      success: true,
      message: `User '${user.name}' and all related data deleted successfully`,
      deleteSummary: {
        userDeleted: deleteResults[0].deletedCount,
        inputsDeleted: deleteResults[1].deletedCount,
        questionsDeleted: deleteResults[2].deletedCount,
        answersDeleted: deleteResults[3].deletedCount,
        reportsDeleted: deleteResults[4].deletedCount,
      },
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ success: false, message: "Error deleting user", error: err.message });
  }
});

module.exports = { adminRouter };