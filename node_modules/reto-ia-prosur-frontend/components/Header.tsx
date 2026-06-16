import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { href: '#premios', label: 'Premios' },
    { href: '#reglas', label: 'Reglas' },
    { href: '#registro', label: 'Registro' },
    { href: '#cronograma', label: 'Cronograma' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <a href="#" className="flex items-center focus:outline-none focus:ring-2 focus:ring-prosur-red rounded">
              <img 
                src="./logoprosur.png" 
                alt="Logo Grupo Prosur" 
                width={225}
                height={225}
                className="h-24 w-auto object-contain" 
              />
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8" aria-label="Navegación principal">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-prosur-gray hover:text-prosur-red font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-prosur-red rounded px-2 py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-prosur-gray hover:text-prosur-red focus:outline-none focus:ring-2 focus:ring-prosur-red rounded p-2"
              aria-expanded={isMenuOpen}
              aria-label="Abrir menú principal"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <nav className="px-2 pt-2 pb-3 space-y-1 sm:px-3" aria-label="Navegación móvil">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-prosur-gray hover:text-prosur-red hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-prosur-red"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
