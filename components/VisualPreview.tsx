import React, { useState, useCallback, useEffect } from 'react';
import html2canvas from 'html2canvas';
import { DownloadIcon, CopyIcon, CheckIcon, ImageIcon } from './icons/Icons.tsx';

interface VisualPreviewProps {
  htmlCode: string;
  previewWidth: string;
}

// Fullscreen Icon Component
const FullscreenIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M4 8V4m0 0h4M4 4l5 5m11-5h-4m4 0v4m0-4l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" 
    />
  </svg>
);

// Exit Fullscreen Icon Component
const ExitFullscreenIcon = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth={2} 
      d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0-4.5l5.5 5.5" 
    />
  </svg>
);

// Loading Spinner Component
const LoadingSpinner = ({ className }: { className?: string }) => (
  <div className={`border-2 border-current border-t-transparent rounded-full animate-spin ${className}`} />
);

// Tooltip Component
const Tooltip: React.FC<{ text: string; children: React.ReactNode }> = ({ text, children }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-900 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
      {text}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900" />
    </div>
  </div>
);

const VisualPreview: React.FC<VisualPreviewProps> = ({ htmlCode, previewWidth }) => {
  const [isCopying, setIsCopying] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const iframeSrcDoc = `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
        <style> 
          body { 
            font-family: 'Poppins', sans-serif; 
            margin: 0;
            padding: 0;
          } 
        </style>
      </head>
      <body class="bg-white">
        ${htmlCode}
        <script>
          document.addEventListener('click', function(e) {
            const target = e.target.closest('a, button, [role="button"], input[type="submit"]');
            if (target) {
              e.preventDefault();
            }
          }, true);
          
          // Signal when page is loaded
          window.addEventListener('load', function() {
            setTimeout(() => {
              parent.postMessage('iframe-loaded', '*');
            }, 100);
          });
        </script>
      </body>
    </html>
  `;

  // Handle iframe load
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data === 'iframe-loaded') {
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    return () => document.removeEventListener('keydown', handleEscapeKey);
  }, [isFullscreen]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isFullscreen]);

  const generateCanvas = useCallback(async (): Promise<HTMLCanvasElement> => {
    const renderContainer = document.createElement('div');
    renderContainer.id = 'dassigner-render-container';
    
    Object.assign(renderContainer.style, {
      position: 'absolute',
      top: '-9999px',
      left: '-9999px',
      width: '1280px',
      backgroundColor: 'white',
      fontFamily: `'Poppins', sans-serif`,
    });
    
    renderContainer.innerHTML = htmlCode;
    document.body.appendChild(renderContainer);

    const images = Array.from(renderContainer.getElementsByTagName('img'));
    const imageLoadPromises = images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise<void>((resolve) => {
        img.crossOrigin = 'anonymous';
        img.onload = () => resolve();
        img.onerror = () => {
          console.warn(`Could not load image for canvas export: ${img.src}`);
          resolve(); 
        };
      });
    });

    try {
      await Promise.all(imageLoadPromises);
      await new Promise(resolve => setTimeout(resolve, 100));

      const canvas = await html2canvas(renderContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });
      return canvas;
    } finally {
      if (document.body.contains(renderContainer)) {
        document.body.removeChild(renderContainer);
      }
    }
  }, [htmlCode]);

  const handleCopyImage = useCallback(async () => {
    setIsCopying(true);
    setCopySuccess(false);
    try {
      const canvas = await generateCanvas();
      canvas.toBlob(async (blob) => {
        if (!blob) { throw new Error("Canvas to Blob conversion failed."); }
        try {
          await navigator.clipboard.write([ new ClipboardItem({ 'image/png': blob }) ]);
          setCopySuccess(true);
          setTimeout(() => setCopySuccess(false), 2500);
        } catch (clipError) {
          console.error('Clipboard write failed:', clipError);
          alert('Failed to copy image. Your browser might have blocked it. Please try again or download instead.');
        }
      }, 'image/png');
    } catch (err) {
      console.error('Failed to copy image:', err);
      alert('Failed to generate image for copying. Please try downloading instead.');
    } finally {
      setIsCopying(false);
    }
  }, [generateCanvas]);

  const handleDownloadImage = useCallback(async () => {
    setIsDownloading(true);
    try {
      const canvas = await generateCanvas();
      const link = document.createElement('a');
      link.download = 'dassigner-ai-design.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to download image:', err);
       alert('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  }, [generateCanvas]);

  const handleExportHtml = () => {
    const fullHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://cdn.tailwindcss.com"></script>
  <title>DAssigner Ai Design</title>
  <!-- Generated with DAssigner AI -->
</head>
<body class="bg-white">
  ${htmlCode}
</body>
</html>`;
    const blob = new Blob([fullHtml.trim()], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'dassigner-ai-design.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const ActionButton: React.FC<{
    onClick: () => void;
    disabled?: boolean;
    tooltip: string;
    variant?: 'default' | 'primary';
    children: React.ReactNode;
  }> = ({ onClick, disabled = false, tooltip, variant = 'default', children }) => (
    <Tooltip text={tooltip}>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          group p-3 rounded-full transition-all duration-200 
          ${disabled 
            ? 'opacity-50 cursor-not-allowed' 
            : 'hover:scale-105 active:scale-95'
          }
          ${variant === 'primary' 
            ? 'bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl' 
            : 'bg-white/90 hover:bg-white text-gray-700 shadow-md hover:shadow-lg'
          }
          backdrop-blur-sm border border-gray-200/50
        `}
      >
        {children}
      </button>
    </Tooltip>
  );

  return (
    <>
      {/* Main Preview Container */}
      <div className="relative w-full h-full animate-fade-in flex justify-center items-start">
        <div 
          className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-cyan-400/10 rounded-lg overflow-hidden shadow-lg dark:shadow-2xl dark:shadow-black/50 transition-all duration-500 ease-in-out relative" 
          style={{height: 'calc(100vh - 12rem)', width: previewWidth}}
        >
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="flex flex-col items-center gap-3">
                <LoadingSpinner className="w-8 h-8 text-blue-500" />
                <p className="text-sm text-gray-600 dark:text-gray-400">Loading preview...</p>
              </div>
            </div>
          )}

          <iframe
            srcDoc={iframeSrcDoc}
            title="Live HTML Preview"
            className="w-full h-full border-0 bg-white"
            sandbox="allow-scripts"
          />
        </div>
        
        {/* Action Buttons */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
          <div className="flex items-center gap-2 bg-gray-900/20 dark:bg-gray-800/40 backdrop-blur-xl p-2 rounded-2xl border border-white/20 shadow-2xl">
            <ActionButton
              onClick={handleCopyImage}
              disabled={isCopying || copySuccess}
              tooltip="Copy as PNG"
            >
              {copySuccess ? (
                <CheckIcon className="w-5 h-5 text-green-500 transition-transform group-hover:scale-110" />
              ) : (
                <CopyIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
              )}
            </ActionButton>

            <ActionButton
              onClick={handleDownloadImage}
              disabled={isDownloading}
              tooltip="Download as PNG"
            >
              {isDownloading ? (
                <LoadingSpinner className="w-5 h-5" />
              ) : (
                <ImageIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
              )}
            </ActionButton>

            <ActionButton
              onClick={handleExportHtml}
              tooltip="Download HTML file"
            >
              <DownloadIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
            </ActionButton>

            <ActionButton
              onClick={toggleFullscreen}
              tooltip="View fullscreen"
              variant="primary"
            >
              <FullscreenIcon className="w-5 h-5 transition-transform group-hover:scale-110" />
            </ActionButton>
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex flex-col">
          {/* Fullscreen Header */}
          <div className="flex justify-between items-center p-4 bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-white/80 text-sm font-medium ml-2">DAssigner AI Design - Fullscreen</span>
            </div>
            
            <div className="flex items-center gap-2 mx-5 px-5 py-2">
              <ActionButton
                onClick={handleCopyImage}
                disabled={isCopying || copySuccess}
                tooltip="Copy as PNG"
              >
                {copySuccess ? (
                  <CheckIcon className="w-4 h-4 text-green-500" />
                ) : (
                  <CopyIcon className="w-4 h-4" />
                )}
              </ActionButton>

              <ActionButton
                onClick={handleDownloadImage}
                disabled={isDownloading}
                tooltip="Download as PNG"

              >
                {isDownloading ? (
                  <LoadingSpinner className="w-4 h-4" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
              </ActionButton>

              <ActionButton
                onClick={handleExportHtml}
                tooltip="Download HTML file"
              >
                <DownloadIcon className="w-4 h-4" />
              </ActionButton>

              <ActionButton
                onClick={toggleFullscreen}
                tooltip="Exit fullscreen (Esc)"
                variant="primary"
              >
                <ExitFullscreenIcon className="w-4 h-4" />
              </ActionButton>
            </div>
          </div>

          {/* Fullscreen Content */}
          <div className="flex-1 p-4 overflow-hidden">
            <div className="w-full h-full bg-white rounded-lg shadow-2xl overflow-hidden">
              <iframe
                srcDoc={iframeSrcDoc}
                title="Fullscreen HTML Preview"
                className="w-full h-full border-0 bg-white"
                sandbox="allow-scripts"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VisualPreview;