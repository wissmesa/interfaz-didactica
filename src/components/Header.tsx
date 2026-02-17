'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { siteNav } from '@/data/site';

interface HeaderProps {
  onContactClick?: () => void;
}

export function Header({ onContactClick }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-white/80 backdrop-blur-sm'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0 group">
            <Image
              src="/logo.png"
              alt="Interfaz Didáctica C.A."
              width={160}
              height={56}
              className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {siteNav.map((item) => {
              const isAnchor = item.href.startsWith('/#');
              const isActive =
                pathname === '/' && isAnchor;

              if (isAnchor && pathname === '/') {
                return (
                  <a
                    key={item.href}
                    href={item.href.replace('/', '')}
                    className={`text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? 'text-brand-navy'
                        : 'text-slate-500 hover:text-brand-navy'
                    }`}
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium text-slate-500 hover:text-brand-navy transition-colors duration-200"
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              onClick={onContactClick}
              className="bg-brand-orange text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-orange-hover transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Cotizar ahora
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-brand-navy hover:bg-slate-50 transition-colors duration-200"
            aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? 'max-h-80 opacity-100 pb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="flex flex-col gap-1 pt-2 border-t border-slate-100">
            {siteNav.map((item) => {
              const isAnchor = item.href.startsWith('/#');

              if (isAnchor && pathname === '/') {
                return (
                  <a
                    key={item.href}
                    href={item.href.replace('/', '')}
                    onClick={handleNavClick}
                    className="text-sm font-medium text-slate-600 hover:text-brand-navy hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors duration-200"
                  >
                    {item.label}
                  </a>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="text-sm font-medium text-slate-600 hover:text-brand-navy hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors duration-200"
                >
                  {item.label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                onContactClick?.();
                setIsMenuOpen(false);
              }}
              className="mt-2 bg-brand-orange text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-brand-orange-hover transition-colors duration-200 text-center"
            >
              Cotizar ahora
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
