import React from 'react';
import { Trophy, Medal } from 'lucide-react';

export default function Prizes() {
  return (
    <section id="premios" className="py-20 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Premios del Reto</h2>
          <p className="text-lg text-prosur-gray max-w-2xl mx-auto">
            Reconocemos el talento y la innovación. Estos son los premios para los equipos que logren el mayor impacto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center max-w-5xl mx-auto">
          {/* 2nd Place */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 text-center transform transition-transform hover:-translate-y-1 order-2 md:order-1">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-6">
              <Medal className="w-8 h-8 text-gray-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">2do Lugar</h3>
            <p className="text-3xl font-bold text-prosur-gray">$10,000 <span className="text-lg font-medium">MXN</span></p>
          </div>

          {/* 1st Place */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border-2 border-prosur-red p-10 text-center transform transition-transform hover:-translate-y-2 relative order-1 md:order-2 z-10">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-prosur-red text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider shadow-md">
              Gran Ganador
            </div>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-50 mb-6">
              <Trophy className="w-10 h-10 text-prosur-red" aria-hidden="true" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">1er Lugar</h3>
            <p className="text-4xl font-extrabold text-prosur-red">$15,000 <span className="text-xl font-semibold">MXN</span></p>
          </div>

          {/* 3rd Place */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 p-8 text-center transform transition-transform hover:-translate-y-1 order-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-50 mb-6">
              <Medal className="w-8 h-8 text-orange-400" aria-hidden="true" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">3er Lugar</h3>
            <p className="text-3xl font-bold text-prosur-gray">$5,000 <span className="text-lg font-medium">MXN</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}