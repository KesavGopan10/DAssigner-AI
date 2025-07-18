import React, { useState, useEffect } from 'react';
import { XMarkIcon, Cog6ToothIcon, InformationCircleIcon } from './icons/Icons.tsx';
import { useAppContext } from '../App.tsx';

const SettingsModal: React.FC = () => {
  const { state, dispatch, handleSaveApiKey } = useAppContext();
  const { apiKey } = state;
  const [apiKeyInput, setApiKeyInput] = useState(apiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  
  const isDismissable = !!apiKey;

  const onClose = () => {
    if (isDismissable) {
      dispatch({ type: 'SET_IS_SETTINGS_OPEN', payload: false });
    }
  };

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isDismissable) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isDismissable]);

  const handleSaveClick = () => {
    if (apiKeyInput.trim()) {
      handleSaveApiKey(apiKeyInput.trim());
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && apiKeyInput.trim()) {
      handleSaveClick();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-slate-100 dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-300 dark:border-cyan-500/30 flex flex-col transform transition-transform duration-300 scale-95 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-cyan-500/20">
          <div className="flex items-center gap-3">
            <Cog6ToothIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">API Key Settings</h2>
          </div>
          {isDismissable && (
            <button 
              onClick={onClose} 
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close settings"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(100vh-150px)]">
          {!isDismissable && (
            <div className="bg-cyan-600/10 dark:bg-cyan-500/10 p-4 rounded-lg border border-cyan-600/20 dark:border-cyan-500/20 mb-6 flex items-start gap-3">
              <InformationCircleIcon className="w-5 h-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0"/>
              <div>
                <h3 className="font-bold text-cyan-800 dark:text-cyan-200 text-sm">Welcome to DAssigner AI!</h3>
                <p className="text-sm text-cyan-700 dark:text-cyan-300 mt-1">
                  To begin generating designs, you'll need to provide your Google Gemini API key. 
                  This key is stored locally in your browser and never sent to our servers.
                </p>
              </div>
            </div>
          )}
         
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="apiKey" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Your Gemini API Key
              </label>
              <button 
                onClick={() => setShowKey(!showKey)}
                className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline"
              >
                {showKey ? 'Hide' : 'Show'} key
              </button>
            </div>
            <div className="relative">
              <input
                id="apiKey"
                type={showKey ? "text" : "password"}
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter your Gemini API key here"
                className="w-full p-3 pr-10 bg-white dark:bg-slate-800 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-colors duration-200 text-slate-800 dark:text-slate-200"
                autoFocus
              />
              {apiKeyInput && (
                <button
                  onClick={() => setApiKeyInput('')}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  aria-label="Clear input"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            {isSaved && (
              <p className="mt-2 text-sm text-green-600 dark:text-green-400">
                ✓ API Key saved successfully!
              </p>
            )}
          </div>

          <div className="bg-amber-500/10 p-4 rounded-lg border border-amber-500/20 mb-6 flex items-start gap-3">
            <InformationCircleIcon className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0"/>
            <div>
              <h3 className="font-bold text-amber-800 dark:text-amber-200 text-sm">Security Notice</h3>
              <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                For your security, we recommend creating a new API key specifically for this app. 
                You can revoke it anytime in Google AI Studio.
              </p>
            </div>
          </div>
          
          <div className="bg-slate-200/50 dark:bg-slate-800/30 p-4 rounded-lg border border-slate-300/50 dark:border-slate-700">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-3">How to get a Gemini API Key</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>Go to <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 font-medium underline hover:text-cyan-500">Google AI Studio</a></li>
              <li>Click <strong>"Create API key"</strong> in the top right</li>
              <li>Select or create a Google Cloud project when prompted</li>
              <li>Copy your new API key</li>
              <li>Paste it above and click <strong>"Save"</strong></li>
            </ol>
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-500">
              Note: The free tier has generous limits, but you may need to enable billing for heavy usage.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-5 border-t border-slate-200 dark:border-cyan-500/20 bg-slate-200/50 dark:bg-slate-900/50 rounded-b-2xl">
          {isDismissable ? (
            <button
              onClick={onClose}
              className="text-slate-700 dark:text-slate-300 font-medium py-2 px-5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors duration-200"
            >
              Cancel
            </button>
          ) : (
            <div className="text-xs text-slate-500 dark:text-slate-400">
              You must provide an API key to continue
            </div>
          )}
          <button
            onClick={handleSaveClick}
            disabled={!apiKeyInput.trim()}
            className={`bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-900 font-semibold py-2 px-5 rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 transition-colors duration-200 shadow-lg ${
              apiKeyInput.trim() ? 'shadow-cyan-600/20 dark:shadow-cyan-500/30' : 'shadow-none'
            }`}
          >
            {isDismissable ? 'Save Changes' : 'Save & Start Designing'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;