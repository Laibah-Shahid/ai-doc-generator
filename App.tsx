import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { CodePanel } from './components/CodePanel';
import { DocumentationPanel } from './components/DocumentationPanel';
import { generateDocumentation } from './services/geminiService';

export interface CodeFile {
  path: string;
  name: string;
  content: string;
}

const App: React.FC = () => {
  const [files, setFiles] = useState<CodeFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<CodeFile | null>(null);
  const [documentation, setDocumentation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFolderSelect = useCallback((fileList: FileList) => {
    const filePromises: Promise<CodeFile>[] = [];
    const allowedExtensions = ['.js', '.ts', '.tsx', '.py', '.java', '.cs', '.go', '.rs', '.html', '.css', '.scss', '.json', '.md'];

    for (const file of Array.from(fileList)) {
        const hasAllowedExtension = allowedExtensions.some(ext => file.name.endsWith(ext));
        // @ts-ignore
        const relativePath = file.webkitRelativePath || file.name;
        
        if (hasAllowedExtension && relativePath) {
            const promise = new Promise<CodeFile>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const content = e.target?.result as string;
                    resolve({ path: relativePath, name: file.name, content });
                };
                reader.onerror = (err) => reject(err);
                reader.readAsText(file);
            });
            filePromises.push(promise);
        }
    }

    Promise.all(filePromises)
      .then(loadedFiles => {
        const sortedFiles = loadedFiles.sort((a, b) => a.path.localeCompare(b.path));
        setFiles(sortedFiles);
        setSelectedFile(sortedFiles[0] || null);
        setDocumentation(null);
        setError(null);
      })
      .catch(err => {
        console.error("Error reading files:", err);
        setError("There was an error reading the folder. Please ensure all files are valid text files.");
      });
  }, []);

  const handleFileSelect = useCallback((file: CodeFile) => {
    setSelectedFile(file);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    setDocumentation(null);
    setError(null);

    try {
      const result = await generateDocumentation(files);
      setDocumentation(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [files]);
  
  const handleClear = useCallback(() => {
    setFiles([]);
    setSelectedFile(null);
    setDocumentation(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 font-sans">
      <Header />
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          <CodePanel
            files={files}
            selectedFile={selectedFile}
            onFolderSelect={handleFolderSelect}
            onFileSelect={handleFileSelect}
            onGenerate={handleGenerate}
            onClear={handleClear}
            isLoading={isLoading}
          />
          <DocumentationPanel
            documentation={documentation}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
};

export default App;
