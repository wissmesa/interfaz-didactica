export function Logo({ className = 'w-8 h-8' }: { className?: string }) {
return (
<svg
viewBox="0 0 100 40"
className={className}
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
{/* Contorno naranja del logo */}
<path
d="M10 20 Q10 8 20 8 Q30 8 30 20 Q30 32 20 32 Q10 32 10 20"
fill="url(#orangeGradient)"
stroke="#f97316"
strokeWidth="1"
/>

{/* Letra I */}
<path
d="M15 12 L25 12 M20 12 L20 28 M15 28 L25 28"
stroke="url(#blueGradient)"
strokeWidth="2"
strokeLinecap="round"
/>

{/* Letra D */}
<path
d="M35 12 L45 12 Q50 12 50 20 Q50 28 45 28 L35 28 Z"
fill="url(#blueGradient)"
stroke="url(#blueGradient)"
strokeWidth="1"
/>

{/* Gradientes */}
<defs>
<linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#f97316" />
<stop offset="100%" stopColor="#ea580c" />
</linearGradient>
<linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
<stop offset="0%" stopColor="#1e40af" />
<stop offset="100%" stopColor="#3b82f6" />
</linearGradient>
</defs>
</svg>
);
}
