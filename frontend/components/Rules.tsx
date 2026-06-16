import React from 'react';
import { Users, Cpu, Zap, FileDown } from 'lucide-react';

export default function Rules() {
  const rules = [
    {
      icon: <Users className="w-6 h-6 text-prosur-red" aria-hidden="true" />,
      title: "Participación Abierta",
      description: "Participan todos los colaboradores de las empresas del grupo, excepto el departamento de Sistemas (TI)."
    },
    {
      icon: <Cpu className="w-6 h-6 text-prosur-red" aria-hidden="true" />,
      title: "Objetivo del Proyecto",
      description: "El objetivo es crear una primera versión funcional (MVP) que automatice tareas o haga el trabajo más fácil en su área."
    },
    {
      icon: <Zap className="w-6 h-6 text-prosur-red" aria-hidden="true" />,
      title: "Criterios de Evaluación",
      description: "Se evaluará qué tan posible es hacerlo, si puede crecer a otras áreas y el uso inteligente de los recursos (lograr el mayor impacto de la forma más sencilla)."
    }
  ];

  return (
    <section id="reglas" className="py-20 bg-white/60 backdrop-blur-lg border-y border-white/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Reglas Clave</h2>
          <p className="text-lg text-prosur-gray max-w-2xl mx-auto">
            Conoce los lineamientos principales para asegurar que tu proyecto cumpla con los objetivos del reto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {rules.map((rule, index) => (
            <div key={index} className="bg-white/80 rounded-xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center mb-6 border border-red-100">
                {rule.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{rule.title}</h3>
              <p className="text-prosur-gray leading-relaxed">{rule.description}</p>
            </div>
          ))}
        </div>

        {/* Botón para descargar bases */}
        <div className="mt-16 text-center">
          <a 
            href="./Base_IA_Grupo_Prosur.pdf" 
            download="Base_IA_Grupo_Prosur.pdf"
            className="inline-flex justify-center items-center px-8 py-3.5 border border-transparent text-base font-medium rounded-lg text-white bg-prosur-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-prosur-red shadow-md transition-all hover:scale-105"
          >
            <FileDown className="mr-2 w-5 h-5" aria-hidden="true" />
            Descargar bases del concurso
          </a>
          <p className="mt-3 text-sm text-prosur-gray font-medium">Documento PDF con todos los detalles y lineamientos.</p>
        </div>
      </div>
    </section>
  );
}
