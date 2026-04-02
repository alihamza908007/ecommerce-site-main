'use client';

import React, { useEffect, useState } from 'react';

interface NotificationAlertProps {
  message: string;
  type: 'success' | 'error' | 'info';
  autoDismiss?: number;
}

export function NotificationAlert({
  message,
  type,
  autoDismiss = 3000,
}: NotificationAlertProps) {
  const [visible, setVisible] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDismissed(true);
      setTimeout(() => setVisible(false), 300);
    }, autoDismiss);

    return () => clearTimeout(timer);
  }, [autoDismiss]);

  if (!visible || dismissed) {
    return null;
  }

  const styles = {
    success: 'border-emerald-400/40 bg-emerald-500/10 text-emerald-100',
    error: 'border-rose-400/40 bg-rose-500/10 text-rose-100',
    info: 'border-indigo-400/40 bg-indigo-500/10 text-indigo-100',
  };

  const iconStyles = {
    success: 'text-emerald-400',
    error: 'text-rose-400',
    info: 'text-indigo-400',
  };

  return (
    <div
      className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all duration-300 animate-slide-in ${
        styles[type]
      }`}
      role="alert"
    >
      <div className={`flex h-5 w-5 items-center justify-center ${iconStyles[type]}`}>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      </div>
      <span className="flex-1">{message}</span>
      <button
        onClick={() => setDismissed(true)}
        className="text-current opacity-60 hover:opacity-100 transition-opacity"
        aria-label="Dismiss notification"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}