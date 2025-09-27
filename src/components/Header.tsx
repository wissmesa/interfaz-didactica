'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { siteNav } from '@/data/site';
import { Logo } from './Logo';

interface HeaderProps {
onContactClick?: () => void;
}

export function Header({ onContactClick }: HeaderProps) {
const pathname = usePathname();
const [isMenuOpen, setIsMenuOpen] = useState(false);

return (
<header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/50 shadow-sm">
<div className="mx-auto max-w-7xl px-4 py-4">
<div className="flex items-center justify-between">
{/* Logo */}
<Link href="/" className="flex items-center space-x-3 group">
<div className="relative">
<Logo className="w-10 h-10 group-hover:scale-110 transition-all duration-500 ease-out" />
{/* Logo glow effect */}
<div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-blue-400/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out scale-125"></div>
</div>
<div className="hidden sm:block">
<div className="text-lg font-bold text-slate-900 group-hover:text-orange-600 transition-colors duration-500 ease-out">
Interfaz Didáctica
</div>
<div className="text-xs text-slate-500 -mt-1 group-hover:text-orange-500 transition-colors duration-500 ease-out">
C.A.
</div>
</div>
</Link>

{/* Desktop Navigation */}
<nav className="hidden md:flex items-center space-x-8">
{siteNav.map((item) => {
const active = pathname === item.href;
return (
<Link
key={item.href}
href={item.href}
className={`relative text-sm font-medium transition-all duration-500 ease-out group ${
active ? 'text-orange-600' : 'text-slate-600 hover:text-orange-600'
}`}
>
{item.label}
{/* Underline animation */}
<div
className={`absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-orange-500 to-blue-500 rounded-full transition-all duration-500 ease-out ${
active ? 'w-full' : 'w-0 group-hover:w-full'
}`}
></div>

{/* Background highlight */}
<div
className={`absolute inset-0 -z-10 bg-gradient-to-r from-orange-50 to-blue-50 rounded-lg transition-all duration-500 ease-out ${
active
? 'opacity-100 scale-100'
: 'opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100'
}`}
></div>

{/* Subtle glow effect */}
<div
className={`absolute inset-0 -z-20 bg-gradient-to-r from-orange-200/20 to-blue-200/20 rounded-lg blur-sm transition-all duration-700 ease-out ${
active
? 'opacity-100 scale-110'
: 'opacity-0 scale-100 group-hover:opacity-100 group-hover:scale-110'
}`}
></div>
</Link>
);
})}
</nav>

{/* CTA Button */}
<div className="hidden md:block">
{onContactClick ? (
<button
onClick={onContactClick}
className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
>
Contactar
<svg
className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24"
>
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M13 7l5 5m0 0l-5 5m5-5H6"
/>
</svg>
</button>
) : (
<Link
href="/contacto"
className="bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
>
Contactar
<svg
className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24"
>
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M13 7l5 5m0 0l-5 5m5-5H6"
/>
</svg>
</Link>
)}
</div>

{/* Mobile Menu Button */}
<button
onClick={() => setIsMenuOpen(!isMenuOpen)}
className="md:hidden p-2 rounded-lg hover:bg-orange-50 transition-all duration-300 ease-out group relative overflow-hidden"
>
<svg
className="w-6 h-6 text-slate-700 group-hover:text-orange-600 transition-colors duration-300 ease-out"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24"
>
{isMenuOpen ? (
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M6 18L18 6M6 6l12 12"
/>
) : (
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M4 6h16M4 12h16M4 18h16"
/>
)}
</svg>
</button>
</div>

{/* Mobile Navigation */}
{isMenuOpen && (
<div className="md:hidden mt-4 pb-4 border-t border-slate-200 animate-in slide-in-from-top-2 duration-300">
<nav className="flex flex-col space-y-3 pt-4">
{siteNav.map((item) => {
const active = pathname === item.href;
return (
<Link
key={item.href}
href={item.href}
onClick={() => setIsMenuOpen(false)}
className={`text-sm font-medium transition-all duration-300 ease-out relative overflow-hidden ${
active
? 'text-orange-600 bg-gradient-to-r from-orange-50 to-blue-50 px-3 py-2 rounded-lg shadow-sm'
: 'text-slate-600 hover:text-orange-600 px-3 py-2 rounded-lg hover:bg-gradient-to-r hover:from-orange-50 hover:to-blue-50 hover:shadow-sm'
}`}
>
{item.label}
</Link>
);
})}
<div className="pt-2">
{onContactClick ? (
<button
onClick={() => {
onContactClick();
setIsMenuOpen(false);
}}
className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold text-center hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
>
Contactar
<svg
className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24"
>
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M13 7l5 5m0 0l-5 5m5-5H6"
/>
</svg>
</button>
) : (
<Link
href="/contacto"
onClick={() => setIsMenuOpen(false)}
className="w-full bg-orange-600 text-white px-4 py-3 rounded-xl font-semibold text-center hover:bg-orange-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
>
Contactar
<svg
className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
fill="none"
stroke="currentColor"
viewBox="0 0 24 24"
>
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M13 7l5 5m0 0l-5 5m5-5H6"
/>
</svg>
</Link>
)}
</div>
</nav>
</div>
)}
</div>
</header>
);
}
