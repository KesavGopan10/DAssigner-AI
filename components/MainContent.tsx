import React, { useState } from 'react';
import { type ExampleItem } from '../types.ts';
import { useAppContext } from '../App.tsx';
import VisualPreview from './VisualPreview.tsx';
import CodePreview from './CodePreview.tsx';
import { EyeIcon, CodeBracketIcon, SparklesIcon, DAssignerLogoIcon, Bars3Icon, Cog6ToothIcon, ComputerDesktopIcon, DeviceTabletIcon, DevicePhoneMobileIcon, XMarkIcon } from './icons/Icons.tsx';

const inspirationExamples: ExampleItem[] = [
  {
    prompt: 'A sleek, modern "Product of the Day" card, dark theme, suitable for a tech launch website.',
    htmlCode: `<div class="p-8 bg-slate-900 rounded-2xl shadow-2xl shadow-cyan-500/10 border border-slate-800 flex items-center gap-8 max-w-2xl mx-auto">
      <img src="https://picsum.photos/seed/producthunt/120/120" alt="Product Logo" class="w-28 h-28 rounded-xl object-cover flex-shrink-0" />
      <div class="flex-grow">
        <h3 class="text-2xl font-bold text-white">QuantumLeap AI</h3>
        <p class="text-slate-400 mt-1 mb-4">The new standard for AI-powered analytics.</p>
        <div class="flex items-center gap-2">
          <button class="bg-cyan-500 text-slate-900 font-bold py-2 px-5 rounded-lg text-sm hover:bg-cyan-400 transition-colors">Upvote (1.2k)</button>
          <button class="border border-slate-700 text-slate-300 font-medium py-2 px-5 rounded-lg text-sm hover:bg-slate-800 transition-colors">Visit Website</button>
        </div>
      </div>
    </div>`
  },
  {
    prompt: 'A clean hero section for a minimalist SaaS application, light theme.',
    htmlCode: `<div class="text-center py-24 px-6 bg-slate-50">
      <h1 class="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tighter">Simplicity Meets Power</h1>
      <p class="max-w-2xl mx-auto mt-6 text-lg text-slate-600">The last project management tool you'll ever need. Streamline your workflow and boost your team's productivity overnight.</p>
      <div class="mt-8 flex justify-center gap-4">
        <button class="bg-slate-900 text-white font-semibold py-3 px-8 rounded-lg hover:bg-slate-700 transition-transform active:scale-95">Get Started Free</button>
        <button class="border border-slate-300 text-slate-700 font-semibold py-3 px-8 rounded-lg hover:bg-slate-200 transition-transform active:scale-95">Learn More</button>
      </div>
    </div>`
  },
  {
    prompt: 'A single, impactful testimonial card with a rating.',
    htmlCode: `<div class="p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto">
      <div class="flex items-center mb-4">
        <img src="https://picsum.photos/seed/testimonial/48/48" alt="Reviewer" class="w-12 h-12 rounded-full object-cover" />
        <div class="ml-4">
          <p class="font-bold text-slate-800">Sarah J.</p>
          <p class="text-sm text-slate-500">CEO, Tech Innovators</p>
        </div>
        <div class="ml-auto flex items-center gap-1 text-amber-400">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <span class="font-bold text-slate-600 text-lg">5.0</span>
        </div>
      </div>
      <p class="text-slate-600 italic">"This tool has completely revolutionized our design process. We're delivering better results, faster than ever before. Highly recommended!"</p>
    </div>`
  },
];

const WelcomeState: React.FC<{
  onLoadExample: (example: ExampleItem) => void;
  isApiKeySet: boolean;
  onOpenSettings: () => void;
}> = ({ onLoadExample, isApiKeySet, onOpenSettings }) => (
  <div className="flex flex-col items-center justify-center min-h-full w-full p-4 sm:p-8 animate-fade-in">
    <div className="text-center mb-12 max-w-4xl">
      <div className="relative mb-8">
        <DAssignerLogoIcon className="w-24 h-24 text-cyan-400 mx-auto drop-shadow-[0_0_20px_rgba(34,211,238,0.6)]" />
        <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-xl animate-pulse"></div>
      </div>
      
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-800 dark:text-white mb-6 tracking-tight leading-tight">
        Design at the 
        <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"> Speed of Thought</span>
      </h2>
      
      <p className="mx-auto text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
        Welcome to your personal AI design studio. Describe any UI component, layout, or webpage, and watch as DAssigner crafts production-ready HTML and Tailwind CSS in real-time.
      </p>
      
      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
          <span>Instant code generation</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
          <span>Production-ready HTML</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
          <span>Tailwind CSS styling</span>
        </div>
      </div>
      
      {!isApiKeySet && (
        <div className="mt-10 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm p-8 rounded-2xl border border-cyan-400/30 max-w-lg mx-auto text-center animate-fade-in shadow-2xl shadow-cyan-500/20">
          <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center border border-cyan-500/30">
            <Cog6ToothIcon className="w-8 h-8 text-cyan-400" />
          </div>
          <h3 className="font-bold text-2xl text-white mb-3">API Key Required</h3>
          <p className="text-slate-300 mb-8 leading-relaxed">
            Set your Google Gemini API key to unlock DAssigner's full creative potential and start designing instantly.
          </p>
          <button
            onClick={onOpenSettings}
            className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-4 px-8 rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/40 w-full sm:w-auto"
          >
            Configure API Key
          </button>
        </div>
      )}
    </div>

    <div className={`w-full max-w-6xl transition-all duration-500 ${!isApiKeySet ? 'opacity-50 pointer-events-none scale-95' : 'opacity-100 scale-100'}`}>
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">
          Kickstart Your Design Journey
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          Choose from these inspiring examples to see DAssigner in action
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {inspirationExamples.map((ex, i) => (
          <div 
            key={i} 
            className="group bg-white/80 dark:bg-slate-900/60 backdrop-blur-sm p-8 rounded-2xl border border-slate-200/50 dark:border-cyan-400/20 hover:border-cyan-400/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-900/30 flex flex-col relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative z-10 flex-grow">
              <div className="flex items-center justify-between mb-6">
                <SparklesIcon className="w-7 h-7 text-cyan-400 group-hover:text-cyan-300 transition-colors" />
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="text-xs font-bold text-cyan-400">{i + 1}</span>
                </div>
              </div>
              
              <p className="text-base font-medium text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
                "{ex.prompt}"
              </p>
            </div>
            
            <button 
              onClick={() => onLoadExample(ex)} 
              className="relative z-10 w-full bg-gradient-to-r from-cyan-600/10 to-blue-600/10 text-cyan-700 dark:text-cyan-400 font-semibold text-sm py-3 px-6 rounded-xl hover:from-cyan-600/20 hover:to-blue-600/20 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-cyan-500/20 hover:border-cyan-500/40"
            >
              Try This Example
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LoadingState: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 dark:text-slate-400 p-8">
    <div className="relative w-32 h-32 mb-8">
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-blue-500/20 blur-xl animate-pulse"></div>
      <DAssignerLogoIcon className="absolute inset-0 m-auto w-16 h-16 text-cyan-400 animate-pulse drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
      <div className="absolute inset-0 w-full h-full border-4 border-cyan-500/20 rounded-full"></div>
      <div className="absolute inset-0 w-full h-full border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
    
    <h2 className="text-3xl font-bold text-slate-800 dark:text-white mb-4">
      Crafting Your Vision
    </h2>
    <p className="max-w-md text-lg text-slate-600 dark:text-slate-300">
      Our AI is designing something amazing for you. This might take a moment.
    </p>
    
    <div className="mt-6 flex items-center gap-2">
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
        <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      </div>
    </div>
  </div>
);

const MainContent: React.FC = () => {
  const { state, dispatch, handleConvertCode, handleLoadExample } = useAppContext();
  const { isLoading, activeDesign, apiKey, isConvertingCode, convertedCodeCache } = state;
  const isApiKeySet = !!apiKey;
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [previewWidth, setPreviewWidth] = useState('100%');

  const onMenuClick = () => dispatch({ type: 'SET_IS_SIDEBAR_OPEN', payload: true });
  const onOpenSettings = () => dispatch({ type: 'SET_IS_SETTINGS_OPEN', payload: true });

  const DeviceButton = ({ 
    width, 
    children, 
    deviceName, 
    tooltipText 
  }: { 
    width: string; 
    children: React.ReactNode; 
    deviceName: string; 
    tooltipText: string; 
  }) => (
    <button
      onClick={() => setPreviewWidth(width)}
      className={`group relative p-1 rounded-lg transition-all duration-200 ${
        previewWidth === width 
          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-500 shadow-lg shadow-cyan-500/20' 
          : 'text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300'
      }`}
      aria-label={`Switch to ${deviceName} view`}
      title={tooltipText}
    >
      {children}
      <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
        {tooltipText}
      </div>
    </button>
  );

  const renderInnerContent = () => {
    if (isLoading && !activeDesign) {
      return <LoadingState />;
    }

    if (!activeDesign) {
      return (
        <WelcomeState 
          onLoadExample={handleLoadExample} 
          isApiKeySet={isApiKeySet}
          onOpenSettings={onOpenSettings}
        />
      );
    }

    return (
      <div className="flex flex-col w-full h-full">
        {/* Enhanced Tab Navigation */}
        <div className="flex-shrink-0 px-4 sm:px-8 pt-6 pb-4 border-b border-slate-200/50 dark:border-cyan-400/20 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('visual')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'visual' 
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-lg shadow-cyan-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <EyeIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Visual Preview</span>
                <span className="sm:hidden">Visual</span>
              </button>
              <button
                onClick={() => setActiveTab('code')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === 'code' 
                    ? 'bg-white dark:bg-slate-800 text-cyan-600 dark:text-cyan-400 shadow-lg shadow-cyan-500/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <CodeBracketIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Code</span>
                <span className="sm:hidden">Code</span>
              </button>
            </div>

            <div className="flex items-center gap-4">
              {/* Device Controls */}
              {activeTab === 'visual' && (
                <div className="hidden sm:flex items-center gap-1 bg-slate-100 dark:bg-slate-900/50 p-1 rounded-xl">
                  <DeviceButton width="375px" deviceName="Mobile" tooltipText="Mobile View (375px)">
                    <DevicePhoneMobileIcon className="w-5 h-5" />
                  </DeviceButton>
                  <DeviceButton width="768px" deviceName="Tablet" tooltipText="Tablet View (768px)">
                    <DeviceTabletIcon className="w-5 h-5" />
                  </DeviceButton>
                  <DeviceButton width="100%" deviceName="Desktop" tooltipText="Desktop View (100%)">
                    <ComputerDesktopIcon className="w-5 h-5" />
                  </DeviceButton>
                </div>
              )}

              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center gap-3 text-sm text-cyan-500 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/20 px-4 py-2 rounded-xl">
                  <div className="w-4 h-4 border-2 border-cyan-300 border-t-transparent rounded-full animate-spin"></div>
                  <span className="font-medium">Updating...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 pattern-bg">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'visual' ? (
              <VisualPreview
                htmlCode={activeDesign.htmlCode}
                previewWidth={previewWidth}
              />
            ) : (
              <CodePreview 
                htmlCode={activeDesign.htmlCode} 
                onConvertCode={handleConvertCode}
                isConverting={isConvertingCode}
                convertedCodeCache={convertedCodeCache}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="lg:ml-96 flex-1 flex flex-col min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Enhanced Mobile Header */}
      <header className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200/50 dark:border-cyan-400/20 sticky top-0 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md z-50">
        {state.isSidebarOpen ? (
          <button
            onClick={() => dispatch({ type: 'SET_IS_SIDEBAR_OPEN', payload: false })}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-cyan-400/10 transition-all duration-200"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        ) : (
          <button
            onClick={onMenuClick}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-cyan-400/10 transition-all duration-200"
            aria-label="Open menu"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
        )}
        
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 p-2 rounded-xl shadow-lg shadow-cyan-500/30">
            <DAssignerLogoIcon className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            DAssigner AI
          </h1>
        </div>
        
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-cyan-400/10 transition-all duration-200"
          aria-label="Open settings"
        >
          <Cog6ToothIcon className="w-6 h-6" />
        </button>
      </header>

      {renderInnerContent()}
    </main>
  );
};

export default MainContent;