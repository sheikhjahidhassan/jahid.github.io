import React, { useState, useEffect } from 'react';

interface PreloaderProps {
  onComplete: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const bootLines = [
    "JubairOS initializing...",
    "Checking system files... [OK]",
    "Loading user profile... [OK]",
    "Mounting animations... [OK]",
    "Connecting to Gemini AI Core... [OK]",
    "Welcome to \"Jubair Ahmad\" World ⚡",
    "Starting GUI..."
  ];

  useEffect(() => {
    if (currentLineIndex >= bootLines.length) {
      setTimeout(() => {
        setIsComplete(true);
        setTimeout(onComplete, 500);
      }, 500);
      return;
    }

    const currentText = bootLines[currentLineIndex];

    if (currentCharIndex < currentText.length) {
      const timeout = setTimeout(() => {
        setLines(prev => {
          const newLines = [...prev];
          if (newLines[currentLineIndex] === undefined) {
            newLines[currentLineIndex] = currentText[currentCharIndex];
          } else {
            newLines[currentLineIndex] += currentText[currentCharIndex];
          }
          return newLines;
        });
        setCurrentCharIndex(prev => prev + 1);
      }, 20); // Typing speed
      return () => clearTimeout(timeout);
    } else {
      const timeout = setTimeout(() => {
        setCurrentLineIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, 100); // Line pause
      return () => clearTimeout(timeout);
    }
  }, [currentLineIndex, currentCharIndex, onComplete, bootLines]);

  return (
    <div 
      className={`fixed inset-0 bg-black z-[10000] flex items-center justify-center font-mono text-green-500 transition-opacity duration-500 ${isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
    >
      <div className="w-[90%] max-w-lg p-4">
        {lines.map((line, index) => (
          <p key={index} className="mb-1 text-sm md:text-base">
            <span dangerouslySetInnerHTML={{ 
              __html: line
                .replace('[OK]', '<span class="text-primary font-bold">[OK]</span>')
                .replace('"Jubair Ahmad"', '<span class="text-cyan-400">"Jubair Ahmad"</span>')
            }} />
          </p>
        ))}
        {!isComplete && (
          <span className="inline-block w-2 h-4 bg-green-500 animate-pulse align-middle ml-1"></span>
        )}
      </div>
    </div>
  );
};

export default Preloader;