'use client'

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className="relative">
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-lg"
        >
          {/* Background Circle */}
          <circle cx="20" cy="20" r="20" fill="url(#gradient)" />
          {/* Task Icon */}
          <path
            d="M12 14h16v2H12v-2zm0 4h16v2H12v-2zm0 4h12v2H12v-2zm0 4h10v2H12v-2z"
            fill="white"
            opacity="0.9"
          />
          {/* Checkmark */}
          <path
            d="M28 16l-2 2-4-4"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#0ea5e9" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {/* Text Logo */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent leading-tight">
          MicroTask
        </span>
        <span className="text-xs text-gray-500 font-medium -mt-1">Earn & Grow</span>
      </div>
    </div>
  )
}
