export function Logo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 56 40"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Contorno naranja del logo */}
      <rect x="1" y="1" width="38" height="38" rx="10" fill="url(#logo-orange)" stroke="#F28500" strokeWidth="1.5" />

      {/* Letra I */}
      <path
        d="M11 12h8M15 12v16M11 28h8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Letra D */}
      <path
        d="M26 12h4a8 8 0 010 16h-4z"
        fill="white"
        fillOpacity="0.9"
      />

      {/* Gradientes */}
      <defs>
        <linearGradient id="logo-orange" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F28500" />
          <stop offset="100%" stopColor="#d97600" />
        </linearGradient>
      </defs>
    </svg>
  );
}
