import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  text = "Loading...",
}) => {
  const sizes = {
    sm: "h-6 w-6",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-slate-300 border-t-indigo-600`}
      />
      {text && <p className="text-slate-600">{text}</p>}
    </div>
  );
};
