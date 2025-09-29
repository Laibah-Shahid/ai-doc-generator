import { GoogleGenAI } from "@google/genai";
import { CodeFile } from '../App';

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY as string });

export async function generateDocumentation(files: CodeFile[]): Promise<string> {
  const codeString = files.map(file => 
    `--- FILE: ${file.path} ---\n\`\`\`\n${file.content}\n\`\`\``
  ).join('\n\n');

  const prompt = `
    As an expert technical writer and senior software architect, your task is to generate high-level technical documentation for an entire software project. The goal is to provide a conceptual overview that helps developers understand the project's architecture, purpose, and the interaction between its core components.

    **IMPORTANT RULE:** Do NOT include any raw source code, code snippets, or line-by-line code comments in your output. The documentation should explain the "what" and "why" at a conceptual level, not the "how" of the implementation.

    The final output must be a single, well-structured Markdown document.

    **DOCUMENTATION STRUCTURE:**

    **1. Project Overview**
       -   **Project Title**: A clear title for the project.
       -   **Description**: A high-level summary of the project's purpose and functionality.
       -   **Key Features**: A bulleted list of the main features.

    **2. Architectural Breakdown**
       -   **Project Structure Analysis**: Analyze the file paths (e.g., 'src/components/Button.tsx') to deduce the project's architecture. Describe the purpose of each main directory (like 'src', 'components', 'services') and how they contribute to the overall design.
       -   **Core Components & Their Roles**: Identify the key components, modules, or services in the application. For each one, provide:
           -   **Name**: The name of the component/file (e.g., App.tsx, geminiService.ts).
           -   **Purpose**: A clear and concise explanation of its primary responsibility within the application. What problem does it solve?
       -   **Interaction and Data Flow**: Describe how the core components work together. Explain the flow of data and events through the application. For example, explain how user actions in a UI component trigger calls to a service, which then updates the application's state.

    Here is the full source code of the project, with each file and its full path clearly demarcated for your analysis:
    ---
    ${codeString}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating documentation:", error);
    throw new Error("Failed to communicate with the AI model. Please check your API key and network connection.");
  }
}
