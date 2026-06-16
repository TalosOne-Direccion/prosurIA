import React from 'react';
import { Rocket, ArrowRight } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative bg-transparent overflow-hidden pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-semibold text-prosur-red bg-red-50 border border-red-100 rounded-full shadow-sm">
            <Rocket className="w-4 h-4 mr-2" aria-hidden="true" />
            Concurso Interno 2026
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
            Reto de Inteligencia Artificial para la <span className="text-prosur-red">Eficiencia Operativa</span>
          </h1>
          
          <p className="text-lg md:text-xl text-prosur-gray mb-10 max-w-3xl mx-auto leading-relaxed">
            Transforma tu área de trabajo, haz tus tareas más fáciles y gana increíbles premios. 
            <strong className="text-gray-800 font-semibold block mt-2">¡Participan todas las empresas de Grupo Prosur!</strong>
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="#registro" 
              className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-prosur-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-prosur-red shadow-md transition-all hover:scale-105"
            >
              Registrar a mi equipo
              <ArrowRight className="ml-2 -mr-1 w-5 h-5" aria-hidden="true" />
            </a>
            <a 
              href="#reglas" 
              className="w-full sm:w-auto inline-flex justify-center items-center px-8 py-3.5 border-2 border-gray-200 text-base font-medium rounded-lg text-prosur-gray bg-white/50 hover:text-gray-900 hover:border-gray-300 hover:bg-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-prosur-gray transition-all"
            >
              Conocer el reto
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}