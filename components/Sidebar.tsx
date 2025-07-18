import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useVoiceRecognition } from '../hooks/useVoiceRecognition.ts';
import { useAppContext } from '../App.tsx';
import {
  DAssignerLogoIcon,
  MicrophoneIcon,
  SendIcon,
  MagicWandIcon,
  HistoryIcon,
  NewChatIcon,
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  PencilIcon,
  FolderOpenIcon,
  SparklesIcon,
  TrashIcon
} from './icons/Icons.tsx';
import { getInspirationPrompts } from '../services/geminiService.ts';

const staticExamplePrompts = [
  "A hero section for a crypto trading platform, dark theme, with glowing charts and a bold CTA.",
  "A pricing table for a SaaS product with a futuristic, cyberpunk aesthetic. Highlight the middle plan.",
  "A team members section with holographic profile cards.",
  "A contact form that looks like a futuristic terminal input.",
];

const Sidebar: React.FC = () => {
  const {
    state,
    dispatch,
    handleSendMessage,
    handleEnhancePrompt,
    handleNewProject,
    handleLoadProject,
    handleDeleteProject,
    projects,
    handleGenerateFromNewProject
  } = useAppContext();

  const {
    isLoading,
    history,
    apiKey,
    chatTitle,
    isComponentMode,
    activeDesign,
    currentProjectId
  } = state;

  const isApiKeySet = !!apiKey;
  const [prompt, setPrompt] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [examplePrompts, setExamplePrompts] = useState<string[]>(staticExamplePrompts);
  const [isLoadingExamples, setIsLoadingExamples] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(chatTitle);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const historyEndRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const projectsDropdownRef = useRef<HTMLDivElement>(null);

  const handleTranscriptUpdate = useCallback((transcript: string) => {
    setPrompt(prev => prev ? `${prev} ${transcript}` : transcript);
  }, []);

  const { isListening, error: voiceError, toggleListening } = useVoiceRecognition(handleTranscriptUpdate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && isApiKeySet) {
      handleSendMessage(prompt);
      setPrompt('');
    }
  };

  const fetchExamples = useCallback(async () => {
    if (!isApiKeySet) return;
    setIsLoadingExamples(true);
    try {
      const prompts = await getInspirationPrompts();
      setExamplePrompts(prompts);
    } catch (e) {
      console.error("Could not fetch example prompts", e);
      setExamplePrompts(staticExamplePrompts);
    } finally {
      setIsLoadingExamples(false);
    }
  }, [isApiKeySet]);

  useEffect(() => {
    if (isApiKeySet) {
      fetchExamples();
    }
  }, [isApiKeySet, fetchExamples]);

  const handleExamplePromptClick = (example: string) => {
    if (isApiKeySet) {
      handleGenerateFromNewProject(example);
    }
  };

  const handleEnhanceClick = async () => {
    if (!prompt.trim() || isEnhancing || !isApiKeySet) return;
    setIsEnhancing(true);
    try {
      const enhancedPrompt = await handleEnhancePrompt(prompt);
      setPrompt(enhancedPrompt);
    } catch (e) {
      console.error("Failed to enhance prompt", e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleTitleSave = () => {
    if (localTitle.trim()) {
      dispatch({ type: 'SET_CHAT_TITLE', payload: localTitle.trim() });
    } else {
      setLocalTitle(chatTitle);
    }
    setIsEditingTitle(false);
  };

  useEffect(() => {
    setLocalTitle(chatTitle);
  }, [chatTitle]);

  useEffect(() => {
    if (isEditingTitle) {
      titleInputRef.current?.focus();
      titleInputRef.current?.select();
    }
  }, [isEditingTitle]);

  useEffect(() => {
    if (isLoading && isListening) {
      toggleListening();
    }
  }, [isLoading, isListening, toggleListening]);

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (projectsDropdownRef.current && !projectsDropdownRef.current.contains(event.target as Node)) {
        setIsProjectsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteClick = (projectId: string) => {
    setProjectToDelete(projectId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteProject = () => {
    if (projectToDelete) {
      handleDeleteProject(projectToDelete);
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    }
  };

  const hasActiveDesign = !!activeDesign;
  const sortedProjects = [...projects].sort((a, b) => b.lastModified - a.lastModified);

  return (
    <aside
      className={`fixed top-0 left-0 z-30 h-full flex flex-col p-4 sm:p-6 border-r border-slate-200 dark:border-cyan-400/20 bg-slate-50 dark:bg-slate-950/80 dark:backdrop-blur-xl w-full sm:w-80 lg:w-96 transform transition-transform duration-300 ease-in-out ${
        state.isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}
    >
      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-100 dark:bg-slate-900 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Confirm Deletion</h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6">
              Are you sure you want to delete this design? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProject}
                className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="bg-cyan-500 p-2 rounded-lg shadow-lg shadow-cyan-500/30 flex-shrink-0">
            <DAssignerLogoIcon className="w-6 h-6 text-slate-900" />
          </div>
          <div className="flex-1 min-w-0 group flex items-center gap-2">
            {isEditingTitle ? (
              <input
                ref={titleInputRef}
                type="text"
                value={localTitle}
                onChange={(e) => setLocalTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
                className="text-xl font-bold bg-transparent border-b-2 border-cyan-400 focus:outline-none w-full"
              />
            ) : (
              <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight truncate">
                {chatTitle}
              </h1>
            )}
            {!isEditingTitle && history.length > 0 && (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
              >
                <PencilIcon className="w-4 h-4 text-slate-500 hover:text-cyan-500" />
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="relative" ref={projectsDropdownRef}>
            <button
              onClick={() => setIsProjectsOpen(prev => !prev)}
              className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-cyan-400/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors tooltip tooltip-right"
              data-tooltip="My Designs"
              aria-haspopup="true"
              aria-expanded={isProjectsOpen}
            >
              <FolderOpenIcon className="w-5 h-5" />
            </button>
            {isProjectsOpen && (
              <div className="absolute top-full right-0 mt-2 w-72 bg-slate-100 dark:bg-slate-900 rounded-lg shadow-2xl border border-slate-200 dark:border-cyan-400/20 z-10 animate-fade-in p-2 custom-scrollbar max-h-96 overflow-y-auto">
                <div className="max-h-80 overflow-y-auto">
                  {sortedProjects.map(p => (
                    <div key={p.id} className="group relative">
                      <button
                        onClick={() => { handleLoadProject(p.id); setIsProjectsOpen(false); }}
                        className={`w-full text-left p-3 rounded-md mb-1 flex items-center justify-between ${
                          p.id === currentProjectId
                            ? 'bg-cyan-100 dark:bg-cyan-500/20'
                            : 'hover:bg-slate-200 dark:hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                            {p.title}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(p.lastModified).toLocaleString([], {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(p.id);
                          setIsProjectsOpen(false);
                        }}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400 z-10"
                      >
                        <TrashIcon className="w-4 h-4 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-500 z-10" />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="p-2 mt-1 border-t border-slate-200 dark:border-cyan-400/20">
                  <button
                    onClick={() => { handleNewProject(); setIsProjectsOpen(false); }}
                    className="w-full flex items-center gap-2 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-semibold text-sm"
                  >
                    <NewChatIcon className="w-5 h-5" />
                    Start New Design
                  </button>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={() => dispatch({ type: 'SET_IS_SETTINGS_OPEN', payload: true })}
            className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-cyan-400/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors tooltip tooltip-right"
            data-tooltip="Settings"
          >
            <Cog6ToothIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_IS_SIDEBAR_OPEN', payload: false })}
            className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-cyan-400/10 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors lg:hidden"
            aria-label="Close menu"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* History Section */}
      <div className="flex-grow overflow-y-auto pr-2 -mr-4 mb-4 space-y-2 custom-scrollbar">
        {history.length === 0 ? (
          <div className="text-left text-slate-500 dark:text-slate-400 pt-6 px-2">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-600 dark:text-slate-300 text-sm tracking-wider">
                Need inspiration?
              </h3>
              <button
                onClick={fetchExamples}
                disabled={isLoadingExamples || !isApiKeySet}
                className="flex items-center gap-1.5 text-xs font-semibold text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <SparklesIcon className={`w-4 h-4 ${isLoadingExamples ? 'animate-spin' : ''}`} />
                <span>New Ideas</span>
              </button>
            </div>
            <div className="space-y-2">
              {isLoadingExamples ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="w-full h-[62px] p-3 rounded-lg bg-slate-200/50 dark:bg-slate-900/50 skeleton-loader"></div>
                ))
              ) : (
                examplePrompts.map((p, i) => (
                  <button
                    key={i}
                    onClick={() => handleExamplePromptClick(p)}
                    disabled={isLoading || !isApiKeySet}
                    className="w-full text-left text-sm p-3 rounded-lg bg-slate-200/50 dark:bg-slate-900/50 dark:border dark:border-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-800/70 dark:hover:border-cyan-400/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {p}
                  </button>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4 p-2">
            {history.map(item => (
              <React.Fragment key={item.id}>
                <div className="flex items-start gap-3 justify-end">
                  <div className="bg-cyan-600 dark:bg-cyan-500 text-white dark:text-slate-900 rounded-lg rounded-br-none py-2 px-3 max-w-[85%]">
                    <p className="text-sm break-words">{item.prompt}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-300 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-5 h-5 text-slate-600 dark:text-slate-300" />
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-cyan-500/20 flex items-center justify-center flex-shrink-0">
                    <DAssignerLogoIcon className="w-5 h-5 text-cyan-500" />
                  </div>
                  <div className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg rounded-bl-none py-2 px-3 max-w-[85%] group relative">
                    <p className="text-sm font-medium">Design Updated</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Ready to view in the main panel.
                    </p>
                    <button
                      onClick={() => dispatch({ type: 'RESTORE_VERSION', payload: item.id })}
                      className="flex items-center gap-1.5 mt-2 text-xs text-cyan-600 dark:text-cyan-400 font-semibold hover:underline"
                    >
                      <HistoryIcon className="w-3.5 h-3.5" />
                      <span>Restore this version</span>
                    </button>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
        <div ref={historyEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col mt-auto pt-4 border-t border-slate-200 dark:border-cyan-400/20">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <label htmlFor="prompt" className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {hasActiveDesign ? 'Describe your changes...' : 'Describe your design...'}
            </label>
          </div>
          <button
            type="button"
            onClick={handleEnhanceClick}
            disabled={isEnhancing || !prompt.trim() || !isApiKeySet}
            className="flex items-center gap-1.5 text-xs text-fuchsia-600 dark:text-fuchsia-400 hover:text-fuchsia-500 dark:hover:text-fuchsia-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors tooltip tooltip-top"
            data-tooltip="Let AI rewrite your prompt with more creative detail"
          >
            {isEnhancing ? (
              <div className="w-4 h-4 border-2 border-slate-400 dark:border-slate-300 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <MagicWandIcon className="w-4 h-4" />
            )}
            Enhance
          </button>
        </div>
        <div className="relative">
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={isApiKeySet ? "e.g., a landing page for a SaaS company" : "Set your API key in settings to begin..."}
            className="w-full p-3 pr-20 bg-slate-100 dark:bg-slate-900/70 rounded-lg border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-cyan-500 dark:focus:ring-cyan-400 focus:border-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-all duration-200 resize-none text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 custom-scrollbar"
            rows={4}
            disabled={isLoading || isEnhancing || !isApiKeySet}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="button"
            onClick={toggleListening}
            disabled={!isApiKeySet}
            className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 tooltip tooltip-top ${
              isListening
                ? 'bg-red-500 text-white animate-pulse'
                : 'bg-slate-200 dark:bg-slate-700 hover:bg-cyan-500 dark:hover:bg-cyan-600 text-slate-500 dark:text-slate-300 hover:text-white dark:hover:text-slate-900'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
            aria-label={isListening ? 'Stop listening' : 'Start listening'}
            data-tooltip={isListening ? 'Stop voice input' : 'Start voice input'}
          >
            <MicrophoneIcon className="w-5 h-5" />
          </button>
        </div>

        {voiceError && (
          <p className="text-red-500 dark:text-red-400 text-xs mt-2">{voiceError}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <div
            className="flex items-center gap-2 tooltip tooltip-right"
            data-tooltip={
              !hasActiveDesign
                ? 'Generate a design first to use Component Mode'
                : isComponentMode
                  ? 'Disable Component Mode: Generate completely new designs from your prompt.'
                  : 'Enable Component Mode: Edit the current design instead of replacing it.'
            }
          >
            <label
              htmlFor="component-mode-toggle"
              className={`flex items-center cursor-pointer ${
                !hasActiveDesign ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <div className="relative">
                <input
                  type="checkbox"
                  id="component-mode-toggle"
                  className="sr-only"
                  checked={isComponentMode}
                  onChange={() => dispatch({ type: 'SET_IS_COMPONENT_MODE', payload: !isComponentMode })}
                  disabled={!hasActiveDesign}
                />
                <div
                  className={`block ${
                    isComponentMode ? 'bg-cyan-500' : 'bg-slate-300 dark:bg-slate-700'
                  } w-10 h-6 rounded-full transition-colors`}
                ></div>
                <div
                  className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${
                    isComponentMode ? 'translate-x-full' : ''
                  }`}
                ></div>
              </div>
              <div className="ml-2 text-xs font-medium text-slate-600 dark:text-slate-300">
                Component Mode
              </div>
            </label>
          </div>
          <button
            type="submit"
            disabled={isLoading || isEnhancing || !prompt.trim() || !isApiKeySet}
            className="flex items-center justify-center gap-2 bg-cyan-600 text-white dark:bg-cyan-500 dark:text-slate-900 font-semibold py-2 px-4 rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-400 disabled:bg-slate-300 dark:disabled:bg-slate-700 disabled:text-slate-500 dark:disabled:text-slate-400 disabled:cursor-not-allowed transition-all duration-200 transform active:scale-95 shadow-md shadow-cyan-600/20 dark:shadow-cyan-500/30"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white dark:border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                <span>Generating...</span>
              </>
            ) : (
              <>
                <SendIcon className="w-5 h-5" />
                <span>{hasActiveDesign ? 'Send Edit' : 'Generate'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </aside>
  );
};

export default Sidebar;
