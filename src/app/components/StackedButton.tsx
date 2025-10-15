import React from 'react';

// Define the props for the component
interface GumroadButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const GumroadButton: React.FC<GumroadButtonProps> = ({ children, className, ...props }) => {
  return (
    <button
      className={`
        group relative inline-block cursor-pointer rounded-lg bg-black px-8 py-4 text-lg font-bold text-white
        transition-transform duration-200 ease-in-out
        hover:-translate-x-1 hover:-translate-y-1
        focus:outline-none 
        ${className}
      `}
      {...props}
    >
      {/* The main button text */}
      <span className="relative z-10">{children}</span>

      {/* Yellow layer (middle) */}
      <div
        className="
          absolute inset-0 -z-5 translate-x-1 translate-y-1 rounded-lg bg-yellow-400
          transition-transform duration-200 ease-in-out group-hover:translate-x-2 group-hover:translate-y-2
        "
      ></div>

      {/* Red layer (bottom) */}
      <div
        className="
          absolute inset-0 -z-10 translate-x-2 translate-y-2 rounded-lg bg-red-500
          transition-transform duration-200 ease-in-out group-hover:translate-x-3 group-hover:translate-y-3
        "
      ></div>
    </button>
  );
};

export default GumroadButton;