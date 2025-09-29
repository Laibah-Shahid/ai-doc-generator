# AI-Powered Documentation Generator

A tool that automatically analyzes a code base and produces high-quality, structured technical documentation.  
It works with any repository by parsing its source files and generating docs that reflect code structure, functions, classes, and relationships.

---

## 🚀 Features

- **Automatic Documentation** — No manual writing needed; generates docstrings, API docs, and markdown files.  
- **Language-agnostic architecture** — Designed to support multiple programming languages (initially Python/TypeScript).  
- **Codebase analysis** — Understands module structure, class hierarchies, functions & parameters.  
- **Configurable output** — Customize format (Markdown, HTML, etc.), sections, and level of detail.  
- **Batch / Bulk support** — Run over entire project or selected files.

---

## 🛠️ Tech Stack & Components

| Layer                | Technology / Library         |
|----------------------|-------------------------------|
| Frontend / UI        | React + Vite (if UI exists)   |
| Backend / Logic      | TypeScript / Node.js          |
| AI / Language Model  | Gemini AI (or configured model) |
| Markdown Rendering   | `react-markdown` + `remark-gfm` |
| File Parsing         | AST parsers / language analyzers |
| Deployment           | Vite preview, Node server, or serverless |

---

## 📂 Repository Structure
Al-powered-document-generator/
├── src/
│ ├── components/ # UI components (if front-end)
│ ├── services/ # Logic for interacting with AI + parsing
│ ├── utils/ # Helper functions (AST parsing, text cleanup)
│ ├── App.tsx # Entry point for UI (if any)
│ └── index.ts # Main runner or server entry
├── docs/ # Generated documentation output (example / template)
├── .env.local # Environment variables (ignored in git)
├── package.json # Dependencies & scripts
├── tsconfig.json # TypeScript config
├── README.md # Project overview (this file)
└── vite.config.ts # (If Vite is used for front-end)



## 📦 Run Locally

### Prerequisites

* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* Gemini API Key 

---

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/ai-powered-document-generator.git
   cd ai-powered-document-generator
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root and add:

   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🤝 Contributing

Feel free to fork this repo and submit a pull request for improvements or new features.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---