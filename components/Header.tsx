
import React from 'react';

const SparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg fill="currentColor" viewBox="0 0 20 20" {...props}>
    <path d="M10 3.5a1.5 1.5 0 013 0V5h-3V3.5zM10 5H3.5a1.5 1.5 0 000 3H5v1.5a1.5 1.5 0 003 0V8h1.5a1.5 1.5 0 003 0V5zm-4.5 5a1.5 1.5 0 000 3H10v1.5a1.5 1.5 0 003 0V13h1.5a1.5 1.5 0 000-3H13v-1.5a1.5 1.5 0 00-3 0V10H5.5z" />
  </svg>
);


export const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="h-8 w-8 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">
              AI Code Documenter
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
};
