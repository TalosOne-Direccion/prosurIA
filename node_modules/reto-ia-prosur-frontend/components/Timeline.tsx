import React from 'react';
import { Calendar, Flag, Presentation } from 'lucide-react';

export default function Timeline() {
  const events = [
    {
      date: "Hoy",
      title: "Apertura de registros",
      icon: <Calendar className="w-6 h-6 text-white" aria-hidden="true" />,
      color: "bg-gray-800"
    },
    {
      date: "23 de Julio",
      title: "Límite para entregar el Alcance del Proyecto",
      icon: <Flag className="w-6 h-6 text-white" aria-hidden="true" />,
      color: "bg-prosur-gray"
    },
    {
      date: "30 de Julio",
      title: "Gran Cierre y Demo Day",
      icon: <Presentation className="w-6 h-6 text-white" aria-hidden="true" />,
      color: "bg-prosur-red"
    }
  ];

  return (
    <section id="cronograma" className="py-20 bg-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Cronograma</h2>
          <p className="text-lg text-prosur-gray">Fechas importantes que no debes dejar pasar.</p>
        </div>

        <div className="relative">
          {/* Desktop horizontal line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gray-300/50 -translate-y-1/2" aria-hidden="true"></div>
          
          {/* Mobile vertical line */}
          <div className="md:hidden absolute top-0 left-8 w-1 h-full bg-gray-300/50" aria-hidden="true"></div>

          <div className="flex flex-col md:flex-row justify-between gap-10 md:gap-4 relative z-10">
            {events.map((event, index) => (
              <div key={index} className="flex md:flex-col items-center md:text-center relative group">
                <div className={`flex-shrink-0 w-16 h-16 rounded-full ${event.color} flex items-center justify-center shadow-lg border-4 border-white/80 z-10 transition-transform group-hover:scale-110`}>
                  {event.icon}
                </div>
                <div className="ml-6 md:ml-0 md:mt-6 bg-white/90 backdrop-blur-sm md:bg-transparent p-4 md:p-0 rounded-lg shadow-sm md:shadow-none border border-gray-100 md:border-none flex-1">
                  <h3 className="text-xl font-bold text-prosur-red mb-1">{event.date}</h3>
                  <p className="text-gray-800 font-medium">{event.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}