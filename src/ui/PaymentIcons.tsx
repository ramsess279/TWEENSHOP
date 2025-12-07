import React from 'react'

export const GoogleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Google logo">
    <path fill="#4285F4" d="M9 3.48c1.69 0 3.15.58 4.33 1.71l3.23-3.14C14.64.62 11.97 0 9 0 5.48 0 2.49 1.88 1.07 4.7l3.77 2.93C5.21 5.02 7.87 3.48 9 3.48z"/>
    <path fill="#34A853" d="M17.64 9.2c0-.63-.06-1.25-.17-1.84H9v3.5h4.84c-.21 1.15-.83 2.13-1.78 2.8l2.73 2.11c1.6-1.49 2.55-3.64 2.55-6.57z"/>
    <path fill="#FBBC05" d="M3.88 10.34A5.94 5.94 0 013 9c0-1.2.36-2.33.99-3.27L1.27 3.8C.44 4.95 0 6.45 0 8c0 1.55.44 3.04 1.27 4.2l2.61-1.86z"/>
    <path fill="#EA4335" d="M9 18c2.46 0 4.53-.8 6.04-2.18l-2.74-2.11c-.75.5-1.71.79-2.71.79-2.13 0-3.9-1.44-4.53-3.36L1.07 14.54C2.49 17.32 5.48 18 9 18z"/>
  </svg>
)

const icons = { GoogleIcon }

export default icons
