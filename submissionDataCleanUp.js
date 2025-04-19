const fs = require("fs");
const path = require("path");

const dataInputFolder = "./dataInput";
const outputFolder = "./redditOutput";

// Ensure output folder exists
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}
fs.readdir(dataInputFolder, (err, files) => {
  if (err) {
    console.error("Error reading input folder:", err);
    return;
  }

  files.forEach((file) => {
    if (path.extname(file) === ".json") {
      const inputFilePath = path.join(dataInputFolder, file);
      fs.readFile(inputFilePath, "utf8", (err, data) => {
        if (err) {
          console.error("Error reading file:", err);
          return;
        }

        let posts;
        try {
          posts = JSON.parse(data);
        } catch (error) {
          console.error("Error parsing JSON:", error);
          return;
        }

        // Process each post
        const processedPosts = posts.map((post) => ({
          title: post.title,
          score: post.score,
          created_date: new Date(post.created_utc * 1000)
            .toISOString()
            .split("T")[0], // Convert to YYYY-MM-DD format
        }));
        // console.log("processedPosts : ", processedPosts);
        const cleanText = (text) => text.replace(/[^a-zA-Z\s]/g, "").trim();

        let submissionOutput = [];

        // Combine titles by date
        const combinedObject = processedPosts.reduce((acc, post) => {
          post.title = cleanText(post.title);
          acc[post.created_date] = acc[post.created_date]
            ? acc[post.created_date] + "\n" + post.title // Append title on a new line
            : post.title;
          return acc;
        }, {});
        // console.log("combinedObject : ", combinedObject);
        // let submissionObject = {};
        for (const [date, text] of Object.entries(combinedObject)) {
          // console.log("date : ", date);
          // console.log("text : ", text);
          // Clean text:
          const cleanedText = text
            .split("\n") // Split into lines
            .map((line) => line.trim()) // Trim spaces from each line
            .filter((line) => line !== "") // Remove empty lines
            .join("\n"); // Join back with a single newline

          const submissionArray = cleanedText.split("\n");
          const utcTimestamp = Math.floor(new Date(date).getTime() / 1000);
          // Create a new submission object for each date
          const submissionObject = {
            date: date,
            date_utc: utcTimestamp,
            submissions: submissionArray,
          };

          console.log("submissionObject :", submissionObject);
          submissionOutput.push(submissionObject);
          // submissionObject.date = date;
          // submissionObject.date_utc = utcTimestamp;
          // submissionObject.submissions = submissionArray;
          // console.log("submissionObject :", submissionObject);
          // submissionOutput.push(submissionObject);
          // console.log("submissionOutput : ", submissionOutput);
        }
        // console.log("submissionOutput : ", submissionOutput);
        // Generate output file names based on input file name
        const baseFileName = path.parse(file).name; // Extract file name without extension
        const jsonFilePath = path.join(outputFolder, `${baseFileName}.json`);

        // Write JSON file
        fs.writeFileSync(
          jsonFilePath,
          JSON.stringify(submissionOutput, null, 2),
          "utf8"
        );
        console.log(`JSON file saved as ${jsonFilePath}`);
      });
    }
  });
});
