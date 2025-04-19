const fs = require("fs");
const path = require("path");
const _ = require("lodash"); // Import Lodash

const dataInputFolder = "./CommentDataInput";
const outputFolder = "./redditCommentOutput";
const BATCH_SIZE = 10000; // Define batch size

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
          console.log("inputFilePath : ", inputFilePath);
          console.error("Error parsing JSON:", error);
          return;
        }

        // Use Lodash _.chunk to split into smaller arrays
        const postChunks = _.chunk(posts, BATCH_SIZE);

        let processedResults = [];

        // Process each chunk
        postChunks.forEach((chunk) => {
          const processedChunk = chunk.map((post) => ({
            title: post.body,
            score: post.score,
            created_date: new Date(post.created_utc * 1000)
              .toISOString()
              .split("T")[0], // Convert to YYYY-MM-DD format
          }));
          processedResults = processedResults.concat(processedChunk);
        });

        const cleanText = (text) =>
          text
            .trim() // Remove leading/trailing spaces & newlines
            .replace(/^[\r\n]+|[\r\n]+$/g, "") // Remove newlines at the start and end
            .replace(/\s+/g, " "); // Replace multiple spaces/newlines with a single space

        let outputObj = [];

        // Combine titles by date
        const combinedObject = processedResults.reduce((acc, post) => {
          post.title = cleanText(post.title);
          acc[post.created_date] = acc[post.created_date]
            ? acc[post.created_date] + "\n" + post.title // Append title on a new line
            : post.title;
          return acc;
        }, {});
        // console.log("combined Object : ", combinedObject);
        let comment = {};
        for (const [date, text] of Object.entries(combinedObject)) {
          const cleanedText = text
            .split("\n") // Split into lines
            .map((line) => line.trim()) // Trim spaces from each line
            .filter((line) => line !== "") // Remove empty lines
            .join("\n"); // Join back with a single newline
          const linesArray = cleanedText.split("\n");
          const utcTimestamp = Math.floor(new Date(date).getTime() / 1000);
          // Create a new submission object for each date
          const comment = {
            date: date,
            date_utc: utcTimestamp,
            submissions: linesArray,
          };

          outputObj.push(comment);
        }

        // Generate output file name
        const baseFileName = path.parse(file).name;
        const jsonFilePath = path.join(outputFolder, `${baseFileName}.json`);

        // Write JSON file
        fs.writeFileSync(
          jsonFilePath,
          JSON.stringify(outputObj, null, 2),
          "utf8"
        );
        console.log(`JSON file saved as ${jsonFilePath}`);
      });
    }
  });
});
