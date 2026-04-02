import React from "react";

interface AlertProps {
  type: "success" | "error" | "warning" | "info";
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type,
  message,
  onClose,
  className = "",
}) => {
  const typeStyles = {
    success: "bg-green-50 border-green-200 text-green-800",
    error: "bg-red-50 border-red-200 text-red-800",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div
      className={`rounded-lg border px-4 py-3 flex items-center justify-between animate-in fade-in slide-in-from-top ${typeStyles[type]} ${className}`}
    >
      <p className="text-sm font-medium">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-lg font-bold hover:opacity-70"
          aria-label="Close alert"
        >
          ×
        </button>
      )}
    </div>
  );
};
