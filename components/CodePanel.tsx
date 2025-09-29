import React, { useCallback, useState, useMemo, useEffect } from 'react';
import { Loader } from './Loader';
import { CodeFile } from '../App';

interface CodePanelProps {
  files: CodeFile[];
  selectedFile: CodeFile | null;
  onFolderSelect: (fileList: FileList) => void;
  onFileSelect: (file: CodeFile) => void;
  onGenerate: () => void;
  onClear: () => void;
  isLoading: boolean;
}

// --- ICONS ---
const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0A2.25 2.25 0 0 1 3.75 7.5h16.5a2.25 2.25 0 0 1 2.25 2.25m-18.75 0h18.75v-1.5A2.25 2.25 0 0 0 19.5 6h-15A2.25 2.25 0 0 0 2.25 7.5v1.5Z" />
    </svg>
);

const FolderOpenIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6.75A2.25 2.25 0 0 1 3.75 4.5h16.5a2.25 2.25 0 0 1 2.25 2.25v3.026" />
  </svg>
);

const FileIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
    </svg>
);

// --- FILE TREE LOGIC ---
interface TreeNode {
  type: 'file' | 'folder';
  name: string;
  file?: CodeFile;
  children?: { [key: string]: TreeNode };
}

const buildFileTree = (files: CodeFile[]): { [key: string]: TreeNode } => {
  const tree: { [key: string]: TreeNode } = {};

  files.forEach(file => {
    let currentLevel = tree;
    const pathParts = file.path.split('/');
    
    pathParts.forEach((part, index) => {
      if (index === pathParts.length - 1) { // It's a file
        currentLevel[part] = { type: 'file', name: part, file: file };
      } else { // It's a folder
        if (!currentLevel[part]) {
          currentLevel[part] = { type: 'folder', name: part, children: {} };
        }
        currentLevel = currentLevel[part].children!;
      }
    });
  });

  return tree;
};

// --- FILE TREE COMPONENT ---
interface FileTreeProps {
  node: { [key: string]: TreeNode };
  onFileSelect: (file: CodeFile) => void;
  selectedFile: CodeFile | null;
  level?: number;
}

const FileTree: React.FC<FileTreeProps> = ({ node, onFileSelect, selectedFile, level = 0 }) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(path)) {
        newSet.delete(path);
      } else {
        newSet.add(path);
      }
      return newSet;
    });
  };
  
  // Auto-expand parent folders of the selected file
  useEffect(() => {
    if (selectedFile) {
        const pathParts = selectedFile.path.split('/');
        let currentPath = '';
        const pathsToExpand = new Set<string>();
        for (let i = 0; i < pathParts.length - 1; i++) {
            currentPath = currentPath ? `${currentPath}/${pathParts[i]}` : pathParts[i];
            pathsToExpand.add(currentPath);
        }
        setExpandedFolders(prev => new Set([...prev, ...pathsToExpand]));
    }
  }, [selectedFile]);

  return (
    <ul style={{ paddingLeft: level > 0 ? '1rem' : '0' }}>
      {Object.keys(node).sort((a,b) => {
        // Sort folders before files
        const nodeA = node[a];
        const nodeB = node[b];
        if (nodeA.type === 'folder' && nodeB.type === 'file') return -1;
        if (nodeA.type === 'file' && nodeB.type === 'folder') return 1;
        return a.localeCompare(b);
      }).map(key => {
        const item = node[key];
        const path = item.file?.path || key;
        
        if (item.type === 'folder') {
          const isExpanded = expandedFolders.has(path);
          return (
            <li key={path}>
              <button
                onClick={() => toggleFolder(path)}
                className="flex items-center w-full text-left px-2 py-1.5 text-sm rounded-md text-gray-300 hover:bg-gray-700/50 hover:text-gray-200"
              >
                {isExpanded ? <FolderOpenIcon className="h-4 w-4 mr-2 flex-shrink-0" /> : <FolderIcon className="h-4 w-4 mr-2 flex-shrink-0" />}
                <span className="truncate font-medium">{key}</span>
              </button>
              {isExpanded && item.children && (
                <FileTree node={item.children} onFileSelect={onFileSelect} selectedFile={selectedFile} level={level + 1} />
              )}
            </li>
          );
        } else { // file
          return (
            <li key={path}>
              <button
                onClick={() => onFileSelect(item.file!)}
                className={`flex items-center w-full text-left px-2 py-1.5 text-sm rounded-md transition-colors ${selectedFile?.path === item.file?.path ? 'bg-blue-600/30 text-white' : 'text-gray-400 hover:bg-gray-700/50 hover:text-gray-200'}`}
              >
                <FileIcon className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{key}</span>
              </button>
            </li>
          );
        }
      })}
    </ul>
  );
};


export const CodePanel: React.FC<CodePanelProps> = ({ files, selectedFile, onFolderSelect, onFileSelect, onGenerate, onClear, isLoading }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const fileTree = useMemo(() => buildFileTree(files), [files]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFolderSelect(e.dataTransfer.files);
    }
  }, [onFolderSelect]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFolderSelect(e.target.files);
    }
  }, [onFolderSelect]);

  if (files.length === 0) {
    return (
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg h-[75vh] transition-colors duration-200 ${isDragging ? 'border-blue-500 bg-gray-800/50' : 'border-gray-600 hover:border-gray-500'}`}
      >
        <input
          type="file"
          id="folder-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
          // @ts-ignore
          webkitdirectory="true"
          directory="true"
          ref={inputRef}
        />
        <FolderIcon className="w-16 h-16 text-gray-500 mb-4" />
        <label htmlFor="folder-upload" className="font-semibold text-blue-500 hover:text-blue-400 cursor-pointer">
          Upload a project folder
        </label>
        <p className="mt-2 text-sm text-gray-400">or drag and drop</p>
        <p className="mt-1 text-xs text-gray-500">Subfolders and source files will be included</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-800 rounded-lg h-[75vh]">
      <div className="flex items-center justify-between p-3 border-b border-gray-700 flex-shrink-0">
        <p className="text-sm font-mono text-gray-400 truncate" title={selectedFile?.path}>{selectedFile?.path || 'No file selected'}</p>
        <div className="flex items-center gap-2">
            <button
                onClick={onClear}
                className="px-3 py-1 text-sm font-semibold text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
            >
                Clear
            </button>
            <button
                onClick={onGenerate}
                disabled={isLoading}
                className="flex items-center justify-center min-w-[80px] px-4 py-1 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed transition-colors"
            >
                {isLoading ? <Loader /> : 'Generate'}
            </button>
        </div>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-1/3 max-w-xs bg-gray-900/50 p-2 overflow-y-auto border-r border-gray-700">
          <nav>
            <FileTree node={fileTree} onFileSelect={onFileSelect} selectedFile={selectedFile} />
          </nav>
        </aside>
        <main className="flex-1 p-4 overflow-auto">
          {selectedFile ? (
            <pre className="text-sm text-gray-300 whitespace-pre-wrap">
              <code>{selectedFile.content}</code>
            </pre>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>Select a file to view its content</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
