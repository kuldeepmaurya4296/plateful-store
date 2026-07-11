'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertTriangle, AlertCircle, Bell } from 'lucide-react';
import { toastAnimation } from '@/lib/animations';

export type ToastType = 'success' | 'warning' | 'error' | 'info' | 'order';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  actions?: {
    label: string;
    onClick: () => void;
    primary?: boolean;
  }[];
}

interface ToastContextType {
  toast: (message: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  toasts: ToastMessage[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = useCallback(({ type, title, description, duration = 4000, actions }: Omit<ToastMessage, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    const newToast: ToastMessage = { id, type, title, description, duration, actions };
    
    setToasts(prev => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ toast, removeToast, toasts }}>
      {children}
      {/* Toast Portal Container */}
      <div className="fixed bottom-4 left-4 z-50 flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              variants={toastAnimation}
              initial="initial"
              animate="animate"
              exit="exit"
              layout
              className="bg-bg-card border border-line rounded-lg shadow-lg p-4 flex gap-3.5 items-start relative w-full"
            >
              {/* Type Icons */}
              <div className="mt-0.5">
                {t.type === 'success' && <CheckCircle className="w-5 h-5 text-success" />}
                {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-warning" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-danger" />}
                {t.type === 'info' && <Bell className="w-5 h-5 text-info" />}
                {t.type === 'order' && <Bell className="w-5 h-5 text-primary animate-bounce" />}
              </div>

              {/* Text details */}
              <div className="flex-1 min-w-0 pr-6">
                <p className="text-sm font-semibold text-ink leading-5 pr-2">{t.title}</p>
                {t.description && (
                  <p className="text-xs text-ink-soft mt-1 leading-4">{t.description}</p>
                )}

                {/* Optional Custom Toast Actions (e.g. Accept/Deny order) */}
                {t.actions && t.actions.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {t.actions.map((act, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          act.onClick();
                          removeToast(t.id);
                        }}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-md border transition-all cursor-pointer ${
                          act.primary
                            ? 'bg-ink text-bg border-ink hover:opacity-90'
                            : 'bg-bg-alt text-ink-soft border-line hover:text-ink hover:bg-bg-alt'
                        }`}
                      >
                        {act.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(t.id)}
                className="absolute top-3 right-3 text-ink-soft hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
