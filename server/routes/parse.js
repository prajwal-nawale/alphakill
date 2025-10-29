function parseReport(aiResponse) {
  const sections = aiResponse.split("####").map(s => s.trim());

  return {
    overallScore: sections[0] || "",
    strengths: sections[1] || "",
    areasToWorkOn: sections[2] || "",
    communicationSkills: sections[3] || "",
    technicalKnowledge: sections[4] || "",
    quickTips: sections[5] || "",
    scoresBreakdown: sections[6] || "",
    answerFeedback: sections[7] || "",
    lastFeedback: sections[8] || ""
  };
}
const aiResponse=
    "Overall Score: 65\n####\nStrengths:\n- You correctly identified MongoDB and Mongoose as tools for database connection, showing you have practical experience with a specific stack.\n- You understood Express.js's role in handling HTTP requests and responses, which is core to its functionality.\n- You mentioned routing, which is one of Express.js's primary use cases.\n####\nAreas to Work On:\n- Your answers are technically correct but lack depth. For example, you should explain *how* Mongoose connects (e.g., mongoose.connect() URI, connection pools, error handling).\n- Avoid over-simplifying concepts. Saying Express \"connects UI with backend\" isn't precise; it's a backend framework that serves data *to* a UI.\n- Structure your answers more clearly. Start with a high-level definition, then break it down into key features and examples.\n####\nCommunication Skills:\nYou're getting the main ideas across, which is good. But you're speaking in fragments and your explanations are a bit jumbled. It sounds like you're thinking out loud instead of delivering a polished answer. Slow down, take a breath, and structure your thoughts before speaking.\n####\nTechnical Knowledge:\nYou have a surface-level, practical understanding from using the tools. You know *what* to use (Mongoose, Express for routing/HTTP) but are missing the deeper *how* and *why*. You didn't mention middleware, which is a core Express.js concept, or discuss alternative databases/drivers. Your knowledge seems based on following tutorials rather than a fundamental understanding of Node.js web servers.\n####\nQuick Tips for Next Time:\n1. Structure your answers: \"Express.js is a framework for Node.js that does X. Its three main features are A, B, and C. For example...\"\n2. Always include a \"how\" for your \"what.\" Instead of just \"I use Mongoose,\" say \"I use the Mongoose ODM because it provides schemas, and I connect by...\"\n3. Prepare 2-3 key points for each common question to ensure you cover fundamentals without rambling.\n####\nScores Breakdown:\nClarity: 6/10\nRelevance: 7/10\nDepth: 4/10\nConfidence: 6/10\nOverall: 6/10\n####\nAnswer Feedback:\nQ1: How would you connect an Express.js application to a database?\nF: You named the tools (MongoDB/Mongoose) but gave zero details on the *process*. This is a critical failure for a technical answer. You must describe the steps: requiring the module, using mongoose.connect() with a connection string, setting up event listeners for 'connected'/'error', and exporting the connection. Mentioning alternative SQL drivers would show broader knowledge.\n\n--\nQ2: Can you explain what Express.js is and what it's commonly used for?\nF: Your explanation was messy and showed some conceptual confusion. Node.js doesn't \"bring JS locally\"—it's a runtime. Express doesn't \"connect UI with backend\"; it *is* the backend framework that builds the API the UI calls. You correctly mentioned routing and HTTP, but you missed the big one: middleware. This is the heart of Express. Always define it as a \"minimal, unopinionated web framework for Node.js used for building APIs and web servers.\"\n####\nLast feedback:\nLook, you didn't bomb, but you didn't shine. You gave bare-minimum answers that felt like you were rushing to just say *something*. For a junior role, we need to see that you're curious and want to understand fundamentals, not just repeat stack names. Your answers were relevant but shallow. Dig deeper next time. If you don't know the full answer, at least show your thought process. \"I've only used Mongoose, but I know the principle is similar for other databases where you'd use their native driver and a connection string...\" shows much more potential than a one-line answer. Put in the work to understand the concepts behind the code."

const parsed = parseReport(aiResponse);
console.log("=== Parsed Report ===");
for (const [key, value] of Object.entries(parsed)) {
  console.log(`\n${key.toUpperCase()}:\n${value}`);
}
