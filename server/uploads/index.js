const fs = require("fs");
const pdf = require("pdf-parse");

async function parsePDF(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);

    console.log("----- PDF Metadata -----");
    console.log(data.info);

    console.log("\n----- PDF Text Content -----");
    console.log(data.text);
  } catch (err) {
    console.error("Error parsing PDF:", err);
  }
}

const filePath = "g.pdf";
parsePDF(filePath);

