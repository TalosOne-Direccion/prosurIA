import React, { useState, useEffect } from 'react';
import { HelpCircle } from 'lucide-react';

export default function Footer() {
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Help Section */}
      <div className="bg-red-50 py-12 border-b border-red-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <HelpCircle className="w-10 h-10 text-prosur-red mx-auto mb-4" aria-hidden="true" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ¿Tienes dudas sobre tu registro o el alcance de tu proyecto?
          </h2>
          <p className="text-prosur-gray mb-6">
            Estamos aquí para apoyarte en cada paso del reto.
          </p>
          <a 
            href="https://wa.me/526672005343" 
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3 border border-prosur-red text-base font-medium rounded-md text-prosur-red bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-prosur-red transition-colors"
          >
            Contactar al equipo organizador
          </a>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center md:justify-start mb-4 md:mb-0">
            <img 
              src="./public/logoprosur.png" 
              alt="Logo Grupo Prosur" 
              width={225}
              height={225}
              className="h-12 w-auto object-contain" 
            />
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-prosur-gray font-medium mb-1">
              Reto de Inteligencia Artificial para la Eficiencia Operativa
            </p>
            <p className="text-sm text-gray-500">
              Impulsando la innovación y la participación de todos nuestros colaboradores.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {year} Grupo Prosur. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}