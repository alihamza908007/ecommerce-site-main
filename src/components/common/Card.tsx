import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  hoverable = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        bg-white border border-violet-100 rounded-xl shadow-md
        ${hoverable ? "cursor-pointer hover:shadow-xl hover:border-violet-200 hover:scale-105 transition-all duration-300" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`px-6 py-4 border-b border-violet-100 bg-gradient-to-r from-violet-50 to-purple-50 ${className}`}
  >
    {children}
  </div>
);

export const CardBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div
    className={`px-6 py-4 border-t border-slate-200 flex gap-2 ${className}`}
  >
    {children}
  </div>
);
