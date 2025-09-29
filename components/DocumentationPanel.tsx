import React from 'react';
import { Loader } from './Loader';

interface DocumentationPanelProps {
  documentation: string | null;
  isLoading: boolean;
  error: string | null;
}

const DocIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
  </svg>
);

const DownloadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);


export const DocumentationPanel: React.FC<DocumentationPanelProps> = ({ documentation, isLoading, error }) => {
  const handleDownload = () => {
    if (!documentation) return;

    // The Gemini API returns a markdown string, which is used directly for the download.
    const blob = new Blob([documentation], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'DOCUMENTATION.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // Clean up the DOM
    URL.revokeObjectURL(url); // Free up memory
  };
  
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <Loader size="lg" />
          <p className="mt-4 text-lg">Generating documentation...</p>
          <p className="text-sm text-gray-500">The AI is analyzing your code. This may take a moment.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-red-400 text-center">
            <p className="text-lg font-semibold">An Error Occurred</p>
            <p className="mt-2 text-sm max-w-md">{error}</p>
        </div>
      );
    }
    
    if (documentation) {
      return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-3 border-b border-gray-700 flex-shrink-0">
                <p className="text-sm font-medium text-gray-200">Generated Documentation</p>
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-3 py-1 text-sm font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
                    title="Download as Markdown"
                    aria-label="Download documentation as a Markdown file"
                >
                    <DownloadIcon className="h-4 w-4" />
                    Download
                </button>
            </div>
            <div className="flex-1 overflow-y-auto">
                <div className="prose prose-invert prose-sm sm:prose-base max-w-none p-6 prose-pre:bg-gray-800 prose-pre:rounded-lg">
                   <div dangerouslySetInnerHTML={{
                      __html: documentation
                        .replace(/---/g, '<hr class="border-gray-600 my-6" />')
                        .replace(/### (.*)/g, '<h3 class="text-blue-400">$1</h3>')
                        .replace(/## (.*)/g, '<h2 class="text-white border-b border-gray-700 pb-2">$1</h2>')
                        .replace(/# (.*)/g, '<h1 class="text-white">$1</h1>')
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="text-gray-200">$1</strong>')
                        .replace(/`([^`]+)`/g, '<code class="bg-gray-700 text-blue-300 rounded px-1.5 py-0.5 font-mono text-sm">$1</code>')
                        .replace(/```([\s\S]*?)```/g, (_match, code) => `<pre class="bg-gray-900 rounded-md p-4 overflow-x-auto"><code class="text-gray-300">${code.trim()}</code></pre>`)
                        .replace(/\n/g, '<br />')
                    }} />
                </div>
            </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
        <DocIcon className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium">Documentation will appear here</p>
        <p className="mt-1 text-sm">Upload a project folder and click "Generate" to start.</p>
      </div>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden h-[75vh]">
      {renderContent()}
    </div>
  );
};