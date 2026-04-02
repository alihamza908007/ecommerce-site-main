import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "danger" | "warning" | "info";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  className = "",
}) => {
  const variants = {
    default: "bg-slate-100 text-slate-800 border border-slate-200",
    success: "bg-emerald-100 text-emerald-800 border border-emerald-200",
    danger: "bg-rose-100 text-rose-800 border border-rose-200",
    warning: "bg-amber-100 text-amber-800 border border-amber-200",
    info: "bg-sky-100 text-sky-800 border border-sky-200",
  };

  return (
    <span
      className={`inline-block px-3 py-1.5 rounded-full text-sm font-semibold ${variants[variant]} ${className} shadow-sm`}
    >
      {children}
    </span>
  );
};
