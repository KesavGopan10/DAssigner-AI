import React, { createContext, useReducer, useCallback, useEffect, useContext, Dispatch, useState } from 'react';
import Sidebar from './components/Sidebar.tsx';
import MainContent from './components/MainContent.tsx';
import SettingsModal from './components/SettingsModal.tsx';
import ToastContainer from './components/Toast.tsx';
import { type DesignOutput, type HistoryItem, type Toast, type ExampleItem, type Project } from './types.ts';
import { initializeAiClient, createChatSession, sendMessageToChat, enhancePrompt as enhancePromptService, convertHtmlToFramework } from './services/geminiService.ts';
import type { Chat } from '@google/genai';
import { Analytics } from "@vercel/analytics/next"

// --- STATE AND REDUCER ---

interface AppState {
  apiKey: string | null;
  isSettingsOpen: boolean;
  isLoading: boolean;
  isSidebarOpen: boolean;
  toasts: Toast[];

  // Session State
  chatSession: Chat | null;
  history: HistoryItem[];
  activeDesign: DesignOutput | null;
  chatTitle: string;
  isComponentMode: boolean;
  currentProjectId: string | null;

  // Code Conversion State
  isConvertingCode: boolean;
  convertedCodeCache: Record<string, string>;
}

type AppAction =
  | { type: 'SET_API_KEY'; payload: string | null }
  | { type: 'SET_IS_SETTINGS_OPEN'; payload: boolean }
  | { type: 'SET_IS_SIDEBAR_OPEN'; payload: boolean }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'START_GENERATION' }
  | { type: 'GENERATION_SUCCESS'; payload: { design: DesignOutput; prompt: string } }
  | { type: 'GENERATION_FAILURE' }
  | { type: 'SET_CHAT_SESSION'; payload: Chat | null }
  | { type: 'RESTORE_VERSION'; payload: string }
  | { type: 'NEW_PROJECT'; payload: { newProjectId: string } }
  | { type: 'SET_CHAT_TITLE'; payload: string }
  | { type: 'SET_IS_COMPONENT_MODE'; payload: boolean }
  | { type: 'LOAD_EXAMPLE'; payload: { example: ExampleItem, newProjectId: string } }
  | { type: 'START_CODE_CONVERSION' }
  | { type: 'CODE_CONVERSION_SUCCESS'; payload: { framework: string; code: string } }
  | { type: 'CODE_CONVERSION_FAILURE'; payload: { framework: string; error: string } }
  | { type: 'LOAD_PROJECT'; payload: Project }
  | { type: 'START_NEW_DESIGN_FROM_PROMPT', payload: { newProjectId: string }};

const initialState: AppState = {
  apiKey: null,
  isSettingsOpen: false,
  isLoading: false,
  isSidebarOpen: false,
  toasts: [],
  chatSession: null,
  history: [],
  activeDesign: null,
  chatTitle: 'New AI Design Session',
  isComponentMode: false,
  isConvertingCode: false,
  convertedCodeCache: {},
  currentProjectId: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_PROJECT':
      return {
          ...state,
          history: action.payload.history,
          activeDesign: action.payload.activeDesign,
          chatTitle: action.payload.title,
          isComponentMode: action.payload.isComponentMode,
          convertedCodeCache: action.payload.convertedCodeCache,
          currentProjectId: action.payload.id,
          chatSession: null, // Reset chat session on project load
          isLoading: false,
          isSidebarOpen: false,
      };
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'SET_IS_SETTINGS_OPEN':
      return { ...state, isSettingsOpen: action.payload };
    case 'SET_IS_SIDEBAR_OPEN':
        return { ...state, isSidebarOpen: action.payload };
    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };
    case 'REMOVE_TOAST':
      return { ...state, toasts: state.toasts.filter(t => t.id !== action.payload) };
    case 'START_GENERATION':
        return { ...state, isLoading: true, isSidebarOpen: false };
    case 'GENERATION_SUCCESS': {
        const newHistoryItem: HistoryItem = {
            id: Date.now().toString(),
            prompt: action.payload.prompt,
            designOutput: action.payload.design,
        };
        const newHistory = [...state.history, newHistoryItem];
        const newChatTitle = state.history.length === 0
            ? action.payload.prompt.substring(0, 40) + (action.payload.prompt.length > 40 ? '...' : '')
            : state.chatTitle;

        return { ...state, isLoading: false, activeDesign: action.payload.design, history: newHistory, chatTitle: newChatTitle, convertedCodeCache: {} };
    }
    case 'GENERATION_FAILURE':
        return { ...state, isLoading: false };
    case 'SET_CHAT_SESSION':
        return { ...state, chatSession: action.payload };
    case 'RESTORE_VERSION': {
        const historyItem = state.history.find(item => item.id === action.payload);
        if (historyItem) {
            return { ...state, activeDesign: historyItem.designOutput, convertedCodeCache: {}, isSidebarOpen: false };
        }
        return state;
    }
    case 'NEW_PROJECT':
        return {
            ...initialState,
            apiKey: state.apiKey,
            isSettingsOpen: state.isSettingsOpen,
            currentProjectId: action.payload.newProjectId,
        };
    case 'SET_CHAT_TITLE':
        return { ...state, chatTitle: action.payload };
    case 'SET_IS_COMPONENT_MODE':
        return { ...state, isComponentMode: action.payload };
    case 'LOAD_EXAMPLE': {
        const newDesign: DesignOutput = { htmlCode: action.payload.example.htmlCode };
        const newHistoryItem: HistoryItem = {
          id: Date.now().toString(),
          prompt: action.payload.example.prompt,
          designOutput: newDesign,
        };
        return {
            ...initialState,
            apiKey: state.apiKey,
            history: [newHistoryItem],
            activeDesign: newDesign,
            chatTitle: action.payload.example.prompt.substring(0, 40) + '...',
            chatSession: null,
            currentProjectId: action.payload.newProjectId,
        };
    }
    case 'START_CODE_CONVERSION':
        return { ...state, isConvertingCode: true };
    case 'CODE_CONVERSION_SUCCESS':
        return {
            ...state,
            isConvertingCode: false,
            convertedCodeCache: { ...state.convertedCodeCache, [action.payload.framework]: action.payload.code }
        };
    case 'CODE_CONVERSION_FAILURE': {
        const errorComment = `/*\n  Code conversion to ${action.payload.framework} failed.\n  Error: ${action.payload.error}\n  Please try again.\n*/`;
        return {
            ...state,
            isConvertingCode: false,
            convertedCodeCache: { ...state.convertedCodeCache, [action.payload.framework]: errorComment }
        };
    }
    case 'START_NEW_DESIGN_FROM_PROMPT':
        return {
            ...initialState,
            apiKey: state.apiKey,
            isSettingsOpen: state.isSettingsOpen,
            currentProjectId: action.payload.newProjectId,
            isLoading: true,
            isSidebarOpen: false,
        };
    default:
      return state;
  }
}

// --- CONTEXT ---

interface AppContextType {
  state: AppState;
  dispatch: Dispatch<AppAction>;
  projects: Project[];
  addToast: (message: string, type?: 'success' | 'error') => void;
  handleSaveApiKey: (key: string | null) => void;
  handleSendMessage: (prompt: string) => Promise<void>;
  handleEnhancePrompt: (prompt: string) => Promise<string>;
  handleConvertCode: (framework: 'React' | 'Vue') => Promise<void>;
  handleLoadProject: (projectId: string) => void;
  handleNewProject: () => void;
  handleDeleteProject: (projectId: string) => void;
  handleLoadExample: (example: ExampleItem) => void;
  handleGenerateFromNewProject: (prompt: string) => Promise<void>;
}

// A default context value that matches the type, preventing runtime errors if used outside a provider.
const defaultContextValue: AppContextType = {
    state: initialState,
    dispatch: () => {},
    projects: [],
    addToast: () => {},
    handleSaveApiKey: () => {},
    handleSendMessage: async () => {},
    handleEnhancePrompt: async () => '',
    handleConvertCode: async () => {},
    handleLoadProject: () => {},
    handleNewProject: () => {},
    handleDeleteProject: () => {},
    handleLoadExample: () => {},
    handleGenerateFromNewProject: async () => {},
};

export const AppContext = createContext<AppContextType>(defaultContextValue);

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === defaultContextValue) {
        throw new Error('useAppContext must be used within an AppContextProvider');
    }
    return context;
}

// --- APP PROVIDER COMPONENT ---

function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [projects, setProjects] = useState<Project[]>([]);

  const { apiKey, history, chatTitle, activeDesign, isComponentMode, convertedCodeCache, chatSession, currentProjectId } = state;

  // Effect for one-time app initialization
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add('dark');

    // --- One-time initialization and migration ---
    const savedApiKey = localStorage.getItem('gemini_api_key');
      if (savedApiKey) {
        try {
            // Support for legacy un-encoded keys
            const decodedKey = atob(savedApiKey);
            dispatch({ type: 'SET_API_KEY', payload: decodedKey });
            initializeAiClient(decodedKey);
        } catch (e) {
            dispatch({ type: 'SET_API_KEY', payload: savedApiKey });
            initializeAiClient(savedApiKey);
        }
    }

    let allProjects: Project[] = [];
    const projectsStr = localStorage.getItem('dassigner_projects');
    if (projectsStr) {
        try {
            allProjects = JSON.parse(projectsStr);
        } catch (e) {
            console.error("Failed to parse projects from localStorage", e);
        }
    }

    // Migration from old single-session storage
    const oldSessionStr = localStorage.getItem('dassigner_session');
    if (oldSessionStr) {
        try {
            const oldSession = JSON.parse(oldSessionStr);
            if (oldSession.history && oldSession.history.length > 0) {
                const newProject: Project = {
                    id: `migrated-${Date.now()}`,
                    title: oldSession.chatTitle || 'Migrated Session',
                    history: oldSession.history,
                    activeDesign: oldSession.activeDesign,
                    isComponentMode: oldSession.isComponentMode || false,
                    lastModified: Date.now(),
                    convertedCodeCache: oldSession.convertedCodeCache || {},
                };
                allProjects.unshift(newProject);
            }
        } catch(e) {
            console.error("Could not parse old session data:", e);
        }
        localStorage.removeItem('dassigner_session');
    }
    
    setProjects(allProjects);

    const lastProjectId = localStorage.getItem('dassigner_currentProjectId');
    let projectToLoad = allProjects.find(p => p.id === lastProjectId);

    if (!projectToLoad && allProjects.length > 0) {
        // Load most recent if last one not found (create a sorted copy, don't mutate)
        projectToLoad = [...allProjects].sort((a,b) => b.lastModified - a.lastModified)[0];
    }

    if (projectToLoad) {
        dispatch({ type: 'LOAD_PROJECT', payload: projectToLoad });
    } else {
        const newProjectId = `proj-${Date.now()}`;
        dispatch({ type: 'NEW_PROJECT', payload: { newProjectId } });
        localStorage.setItem('dassigner_currentProjectId', newProjectId);
    }
  }, []); // Empty dependency array ensures this runs only once on mount.

  // Effect for saving the current project state to localStorage
  useEffect(() => {
    if (!currentProjectId || (history.length === 0 && chatTitle === initialState.chatTitle)) {
      return; // Don't save empty/initial projects
    }

    const projectData: Project = {
        id: currentProjectId,
        title: chatTitle,
        history,
        activeDesign,
        isComponentMode,
        convertedCodeCache,
        lastModified: Date.now(),
    };

    setProjects(prevProjects => {
        const existingIndex = prevProjects.findIndex(p => p.id === currentProjectId);
        let updatedProjects;
        if (existingIndex > -1) {
            updatedProjects = [...prevProjects];
            updatedProjects[existingIndex] = projectData;
        } else {
            updatedProjects = [projectData, ...prevProjects];
        }
        // Debounce or throttle this write if performance becomes an issue
        localStorage.setItem('dassigner_projects', JSON.stringify(updatedProjects));
        return updatedProjects;
    });
  }, [currentProjectId, history, chatTitle, activeDesign, isComponentMode, convertedCodeCache]);


  // --- ACTIONS & HANDLERS (wrapped in useCallback for stability) ---

  const addToast = useCallback((message: string, type: 'success' | 'error' = 'error') => {
    const id = Date.now().toString();
    dispatch({ type: 'ADD_TOAST', payload: { id, message, type } });
  }, []);

  const handleSaveApiKey = useCallback((key: string | null) => {
    if (!key) {
        // Clearing the key
        dispatch({ type: 'SET_API_KEY', payload: null });
        localStorage.removeItem('gemini_api_key');
        dispatch({ type: 'SET_CHAT_SESSION', payload: null }); // Invalidate old chat session
        addToast('API Key cleared.', 'success');
        return;
    }
    try {
      initializeAiClient(key);
      dispatch({ type: 'SET_API_KEY', payload: key });
      const encodedKey = btoa(key); // Always encode for safety
      localStorage.setItem('gemini_api_key', encodedKey);
      dispatch({ type: 'SET_IS_SETTINGS_OPEN', payload: false });
      addToast('API Key saved successfully!', 'success');
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      console.error("API Key Init Error:", errorMessage);
      dispatch({ type: 'SET_API_KEY', payload: null });
      localStorage.removeItem('gemini_api_key');
      addToast(errorMessage, 'error');
    }
  }, [addToast]);

  const handleNewProject = useCallback(() => {
    const newProjectId = `proj-${Date.now()}`;
    dispatch({ type: 'NEW_PROJECT', payload: { newProjectId } });
    localStorage.setItem('dassigner_currentProjectId', newProjectId);
  }, []);

  const handleDeleteProject = useCallback((projectId: string) => {
    setProjects(prevProjects => {
        const updatedProjects = prevProjects.filter(p => p.id !== projectId);
        localStorage.setItem('dassigner_projects', JSON.stringify(updatedProjects));
        
        if (projectId === currentProjectId) {
            const mostRecentProject = [...updatedProjects].sort((a, b) => b.lastModified - a.lastModified)[0];
            if (mostRecentProject) {
                // Defer loading to ensure state updates propagate
                setTimeout(() => dispatch({ type: 'LOAD_PROJECT', payload: mostRecentProject }), 0);
                localStorage.setItem('dassigner_currentProjectId', mostRecentProject.id);
            } else {
                handleNewProject();
            }
        }
        return updatedProjects;
    });
    addToast('Design deleted successfully.', 'success');
  }, [currentProjectId, addToast, handleNewProject]);

  const handleSendMessage = useCallback(async (prompt: string) => {
    if (!apiKey) {
        addToast("API Key is not set.", "error");
        dispatch({type: 'SET_IS_SETTINGS_OPEN', payload: true});
        return;
    }
    dispatch({ type: 'START_GENERATION' });
    try {
        let currentChat = chatSession;
        if (!currentChat) {
            currentChat = await createChatSession();
            dispatch({ type: 'SET_CHAT_SESSION', payload: currentChat });
        }

        let finalPrompt = prompt;
        if(isComponentMode && activeDesign?.htmlCode){
            finalPrompt = `Based on the previous HTML, now add the following component or change: ${prompt}. The previous HTML was:\n\n\`\`\`html\n${activeDesign.htmlCode}\n\`\`\``
        }

        const htmlCode = await sendMessageToChat(currentChat, finalPrompt);
        dispatch({ type: 'GENERATION_SUCCESS', payload: { design: { htmlCode }, prompt } });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during generation.';
        addToast(errorMessage, 'error');
        dispatch({ type: 'GENERATION_FAILURE' });
    }
  }, [apiKey, addToast, chatSession, isComponentMode, activeDesign]);

  const handleEnhancePrompt = useCallback(async (prompt: string): Promise<string> => {
      if (!apiKey) {
        addToast("API Key is not set.", "error");
        throw new Error("API Key not set.");
      }
      return await enhancePromptService(prompt);
  }, [apiKey, addToast]);

  const handleConvertCode = useCallback(async (framework: 'React' | 'Vue') => {
    if (!activeDesign?.htmlCode) return;
    dispatch({ type: 'START_CODE_CONVERSION' });
    try {
        const code = await convertHtmlToFramework(activeDesign.htmlCode, framework);
        dispatch({ type: 'CODE_CONVERSION_SUCCESS', payload: { framework, code } });
    } catch (e) {
        const error = e instanceof Error ? e.message : 'Unknown conversion error';
        dispatch({ type: 'CODE_CONVERSION_FAILURE', payload: { framework, error } });
        addToast(`Failed to convert to ${framework}.`, 'error');
    }
  }, [activeDesign, addToast]);

  const handleLoadProject = useCallback((projectId: string) => {
    const projectToLoad = projects.find(p => p.id === projectId);
    if (projectToLoad) {
        dispatch({ type: 'LOAD_PROJECT', payload: projectToLoad });
        localStorage.setItem('dassigner_currentProjectId', projectId);
    } else {
        addToast('Could not find the project to load.', 'error');
    }
  }, [projects, addToast]);

  const handleLoadExample = useCallback((example: ExampleItem) => {
    const newProjectId = `proj-${Date.now()}`;
    dispatch({ type: 'LOAD_EXAMPLE', payload: { example, newProjectId } });
    localStorage.setItem('dassigner_currentProjectId', newProjectId);
  }, []);

  const handleGenerateFromNewProject = useCallback(async (prompt: string) => {
    if (!apiKey) {
        addToast("API Key is not set.", "error");
        dispatch({type: 'SET_IS_SETTINGS_OPEN', payload: true});
        return;
    }

    const newProjectId = `proj-${Date.now()}`;
    // Dispatching this action resets the state for a new design session
    dispatch({ type: 'START_NEW_DESIGN_FROM_PROMPT', payload: { newProjectId } });
    localStorage.setItem('dassigner_currentProjectId', newProjectId);

    try {
        const newChat = await createChatSession();
        dispatch({ type: 'SET_CHAT_SESSION', payload: newChat });
        const htmlCode = await sendMessageToChat(newChat, prompt);
        dispatch({ type: 'GENERATION_SUCCESS', payload: { design: { htmlCode }, prompt } });
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred during generation.';
        addToast(errorMessage, 'error');
        dispatch({ type: 'GENERATION_FAILURE' });
    }
  }, [apiKey, addToast]);

  const contextValue = {
    state,
    dispatch,
    projects,
    addToast,
    handleSaveApiKey,
    handleSendMessage,
    handleEnhancePrompt,
    handleConvertCode,
    handleLoadProject,
    handleNewProject,
    handleDeleteProject,
    handleLoadExample,
    handleGenerateFromNewProject,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
}

function App() {
  return (
    <AppContextProvider>
      <div className="relative min-h-screen w-full font-sans text-slate-800 dark:text-slate-200">
        <ToastContainer />
        <AppLayout />
      </div>
    </AppContextProvider>
  );
}

function AppLayout() {
  const { state, dispatch } = useAppContext();

  return (
    <>
      {state.isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => dispatch({ type: 'SET_IS_SIDEBAR_OPEN', payload: false })}
          aria-hidden="true"
          role="button" // Improve accessibility for the overlay
          tabIndex={0}
        />
      )}
      <Sidebar />
      <MainContent />
      {state.isSettingsOpen && <SettingsModal />}
      <Analytics />
    </>
  )
}

export default App;