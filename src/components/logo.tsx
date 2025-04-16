import React from 'react'

interface LogoProps {
  className?: string
}

const Logo: React.FC<LogoProps> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      {/* Calendar page background */}
      <rect x="3" y="3" width="18" height="18" rx="4" fill="#f0f0f0" />
      {/* Calendar grid lines */}
      <rect x="5" y="7" width="14" height="2" fill="#3b82f6" />{' '}
      {/* Primary color */}
      <rect x="5" y="11" width="14" height="2" fill="#3b82f6" />{' '}
      {/* Primary color */}
      <rect x="5" y="15" width="14" height="2" fill="#3b82f6" />{' '}
      {/* Primary color */}
      {/* "H" shape */}
      <rect x="7" y="9" width="2" height="6" fill="#3b82f6" />{' '}
      {/* Primary color */}
      <rect x="11" y="9" width="2" height="6" fill="#3b82f6" />{' '}
      {/* Primary color */}
      <rect x="9" y="11" width="2" height="2" fill="#3b82f6" />{' '}
      {/* Primary color */}
      {/* (Implied) "P" shape uses the right side of the calendar grid */}
    </svg>
  )
}

export default Logo
