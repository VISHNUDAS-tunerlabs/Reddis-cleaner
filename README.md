# Reddit Data Processing & Cleaning

![Reddit Data Processing](https://img.shields.io/badge/Reddit-Data%20Processing-blue)

## 🚀 Overview

This repository contains scripts to **process and clean Reddit submissions and comments**, grouping them by each day and converting them into structured JSON format.

## 🛠 Features

- Cleans and structures Reddit submissions and comments.
- Groups data by **date**.
- Handles large datasets efficiently.
- Outputs well-formatted JSON files.

---

## 📥 Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/yourusername/reddit-data-cleanup.git
   cd reddit-data-cleanup
   ```
2. **Install dependencies**
   ```sh
   npm install
   ```

---

## 🔄 Processing Reddit Data

### 📌 Processing **Submissions**

1. Place your input JSON file inside the `dataInput` folder.
2. Run the following command:
   ```sh
   node submissionDataCleanUp.js
   ```
3. The processed JSON will be saved inside the `redditOutput` folder.

### 📝 Processing **Comments**

1. Place your input JSON file inside the `commentDataInput` folder.
2. Run the following command:
   ```sh
   node commentDataCleanUp.js
   ```
3. The processed JSON will be saved inside the `redditCommentOutput` folder.

---

## 📂 Folder Structure

```
root
│── commentDataInput/       # Input folder for Reddit comments
│── dataInput/              # Input folder for Reddit submissions
│── redditOutput/           # Processed submissions output
│── redditCommentOutput/    # Processed comments output
│── commentDataCleanUp.js   # Script to clean Reddit comments
│── submissionDataCleanUp.js # Script to clean Reddit submissions
│── node_modules/           # Dependencies (ignored by Git)
│── package.json            # Project dependencies and scripts
│── .gitignore              # Git ignore settings
│── README.md               # Project documentation
```

---

## 💡 Contributing

Contributions are welcome! Feel free to fork this repository and submit a pull request.

---

## 📜 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

---

### ⭐ If you find this project helpful, don't forget to **star** the repository! 🚀
