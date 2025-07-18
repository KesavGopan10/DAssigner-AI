import React, { useEffect, useState } from 'react';
import { type Toast } from '../types.ts';
import { CheckIcon, XMarkIcon, InformationCircleIcon } from './icons/Icons.tsx';
import { useAppContext } from '../App.tsx';

interface ToastProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

const ToastMessage: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const duration = 5000;
    const interval = 50;
    const decrement = (interval / duration) * 100;

    const progressTimer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev - decrement;
        if (newProgress <= 0) {
          setIsVisible(false);
          setTimeout(() => onDismiss(toast.id), 300); // Wait for exit animation
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(progressTimer);
  }, [toast.id, onDismiss, isPaused]);

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const getToastStyles = () => {
    switch (toast.type) {
      case 'error':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50',
          text: 'text-red-800 dark:text-red-200',
          icon: 'text-red-500 dark:text-red-400',
          progress: 'bg-red-500 dark:bg-red-400',
          Icon: InformationCircleIcon
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/50',
          text: 'text-yellow-800 dark:text-yellow-200',
          icon: 'text-yellow-500 dark:text-yellow-400',
          progress: 'bg-yellow-500 dark:bg-yellow-400',
          Icon: InformationCircleIcon
        };
      case 'info':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50',
          text: 'text-blue-800 dark:text-blue-200',
          icon: 'text-blue-500 dark:text-blue-400',
          progress: 'bg-blue-500 dark:bg-blue-400',
          Icon: InformationCircleIcon
        };
      default: // success
        return {
          bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800/50',
          text: 'text-green-800 dark:text-green-200',
          icon: 'text-green-500 dark:text-green-400',
          progress: 'bg-green-500 dark:bg-green-400',
          Icon: CheckIcon
        };
    }
  };

  const styles = getToastStyles();

  return (
    <div
      className={`
        relative w-full max-w-sm rounded-lg shadow-lg border backdrop-blur-sm
        ${styles.bg} ${styles.text}
        transform transition-all duration-300 ease-out
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
      role="alert"
      aria-live="polite"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-black/10 dark:bg-white/10 w-full rounded-b-lg overflow-hidden">
        <div
          className={`h-full ${styles.progress} transition-all duration-75 ease-linear`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-start p-4 pr-12">
        <div className="flex-shrink-0">
          <styles.Icon className={`w-5 h-5 ${styles.icon}`} />
        </div>
        <div className="ml-3 flex-1 min-w-0">
          <p className="text-sm font-medium leading-5 break-words">
            {toast.message}
          </p>
        </div>
      </div>

      <button
        onClick={handleDismiss}
        className={`
          absolute top-3 right-3 rounded-md p-1.5 
          ${styles.text} opacity-70 hover:opacity-100 
          hover:bg-black/5 dark:hover:bg-white/10
          focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-2 focus:ring-offset-transparent
          transition-all duration-200
        `}
        aria-label="Close notification"
      >
        <XMarkIcon className="h-4 w-4" />
      </button>
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { state, dispatch } = useAppContext();
  const { toasts } = state;
  
  const onDismiss = (id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  };

  if (toasts.length === 0) return null;

  return (
    <div 
      aria-live="polite" 
      aria-label="Notifications"
      className="fixed top-4 right-4 flex flex-col space-y-3 z-[100] pointer-events-none max-w-sm w-full"
    >
      {toasts.map(toast => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastMessage toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;