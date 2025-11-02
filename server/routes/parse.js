function parseReport(aiResponse) {
  const sections = aiResponse.split("####").map(s => s.trim());

  const toArray = (text) => {
    if (!text) return [];
    return text
      .split("\n")
      .map(line => line.replace(/^[-\d\.\s]+/, "").trim())
      .filter(Boolean);
  };

  // Parse answer feedback properly
  const parseAnswerFeedback = (text) => {
    if (!text) return [];
    const feedbackItems = [];
    const blocks = text.split('--').map(b => b.trim()).filter(Boolean);
    
    blocks.forEach(block => {
      const lines = block.split('\n').filter(Boolean);
      let question = '', answer = '', feedback = '';
      
      lines.forEach(line => {
        if (line.startsWith('Q')) {
          question = line.substring(line.indexOf(':') + 1).trim();
        } else if (line.startsWith('A')) {
          answer = line.substring(line.indexOf(':') + 1).trim();
        } else if (line.startsWith('F')) {
          feedback = line.substring(line.indexOf(':') + 1).trim();
        }
      });
      
      if (question && feedback) {
        feedbackItems.push({ question, answer, feedback });
      }
    });
    
    return feedbackItems;
  };

  return {
    overallScore: Number((sections[0].match(/\d+/) || [0])[0]),
    strengths: toArray(sections[1]),
    areasToWorkOn: toArray(sections[2]),
    communicationSkills: sections[3] || "",
    technicalKnowledge: sections[4] || "",
    quickTips: toArray(sections[5]),
    scoresBreakdown: parseScores(sections[6]),
    answerFeedback: parseAnswerFeedback(sections[7]),
    lastFeedback: sections[8] || ""
  };
}
