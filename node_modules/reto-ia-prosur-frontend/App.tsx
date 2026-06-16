import React from 'react';
import { Network, Cpu, BrainCircuit, Sparkles, Bot } from 'lucide-react';
import Header from './components/Header';
import Hero from './components/Hero';
import Prizes from './components/Prizes';
import Rules from './components/Rules';
import RegistrationTabs from './components/RegistrationTabs';
import Tips from './components/Tips';
import Timeline from './components/Timeline';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col relative bg-prosur-bg">
      
      {/* Modern AI Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        {/* Glowing Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-prosur-red/5 blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-prosur-gray/10 blur-[100px] animate-pulse-slow" style={{ animationDelay: '2s' }}></div>

        {/* Floating Tech Elements */}
        <Network className="absolute top-[15%] left-[10%] w-24 h-24 text-prosur-gray/10 animate-float-slow" />
        <BrainCircuit className="absolute top-[65%] right-[10%] w-32 h-32 text-prosur-red/5 animate-float" />
        <Cpu className="absolute bottom-[15%] left-[20%] w-20 h-20 text-prosur-gray/10 animate-float-fast" />
        <Sparkles className="absolute top-[25%] right-[20%] w-16 h-16 text-prosur-red/5 animate-float-slow" style={{ animationDelay: '3s' }} />
        <Bot className="absolute top-[45%] left-[5%] w-16 h-16 text-prosur-gray/10 animate-float-fast" style={{ animationDelay: '1s' }} />

        {/* Floating Logo */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03]">
          <img 
            src="./logoprosur.png" 
            alt="Logo Prosur Fondo" 
            width={350}
            height={350}
            className="w-[60vw] max-w-xl animate-float object-contain" 
            aria-hidden="true" 
          />
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMTM4LCAxNDEsIDE0MywgMC4xKSIvPjwvc3ZnPg==')] opacity-50"></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Hero />
          <Prizes />
          <Rules />
          <RegistrationTabs />
          <Tips />
          <Timeline />
        </main>
        <Footer />
      </div>
    </div>
  );
}
