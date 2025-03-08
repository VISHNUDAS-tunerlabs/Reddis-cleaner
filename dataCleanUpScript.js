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
                const processedPosts = posts.map(post => ({
                    title: post.title,
                    score: post.score,
                    created_date: new Date(post.created_utc * 1000).toISOString().split('T')[0] // Convert to YYYY-MM-DD format
                }));
                const cleanText = (text) => text.replace(/[^a-zA-Z\s]/g, "").trim();

                // Combine titles by date
                const combinedObject = processedPosts.reduce((acc, post) => {
                    post.title = cleanText(post.title)
                    acc[post.created_date] = acc[post.created_date] 
                        ? acc[post.created_date] + '\n' + post.title  // Append title on a new line
                        : post.title;
                    return acc;
                }, {});

                // Convert JSON to CSV format
                let csvContent = "Date,UTC Date,Submission Data\n";

                for (const [date, text] of Object.entries(combinedObject)) {
                    const utcTimestamp = Math.floor(new Date(date).getTime() / 1000);
                
                    // Clean text:
                    const cleanedText = text
                        .split("\n")  // Split into lines
                        .map(line => line.trim())  // Trim spaces from each line
                        .filter(line => line !== "")  // Remove empty lines
                        .join("\n");  // Join back with a single newline
                    csvContent += `"${date}","${utcTimestamp}","${cleanedText}"\n`;
                }

                                // Generate output file names based on input file name
                const baseFileName = path.parse(file).name; // Extract file name without extension
                const csvFilePath = path.join(outputFolder, `${baseFileName}.csv`);

                // Write CSV file
                fs.writeFileSync(csvFilePath, csvContent, "utf8");
                console.log(`CSV file saved as ${csvFilePath}`);

            });
        }
    });
});