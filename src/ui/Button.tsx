import React from 'react'

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, className = '', ...rest }) => {
  return (
    <button
      {...rest}
      className={`px-4 py-2 rounded-md transition-colors hover:opacity-95 ${className}`}
    >
      {children}
    </button>
  )
}

export default Button
