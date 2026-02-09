"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Cpu,
  Zap,
  Share2,
  Layers,
  Target,
  Moon,
  CheckCircle2,
  ArrowRight,
  Play
} from "lucide-react";
import HeroCircuit from "./components/home/HeroCircuit";

// Custom hook for intersection observer animations
function useIntersectionAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
}

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 bg-white/80 backdrop-blur-md h-20 flex items-center justify-center border-b border-gray-100 transition-all duration-500 ${mounted ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex w-full justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <img src="/gate-learning-logo.png" alt="Gate Learning Logo" className="w-34" />
            </div>
            <div className="hidden md:flex items-center gap-8">
              <Link href="#features" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-300 hover:scale-105">
                Características
              </Link>
              <Link href="#how-it-works" className="text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors duration-300 hover:scale-105">
                Cómo funciona
              </Link>
              <Link
                href="/dashboard"
                className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-105 active:scale-95"
              >
                Comenzar
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div className={`mb-12 lg:mb-0 transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
                Simula circuitos lógicos digitales en <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 animate-gradient">tiempo real</span>
              </h1>
              <p className={`text-lg text-gray-600 mb-8 leading-relaxed max-w-lg transition-all duration-700 delay-300 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                Diseña, construye y prueba circuitos lógicos complejos con una interfaz intuitiva. Aprende electrónica digital de forma interactiva sin limitaciones.
              </p>
              <div className={`flex flex-col sm:flex-row gap-4 transition-all duration-700 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
                <Link
                  href="/dashboard"
                  className="inline-flex justify-center items-center px-8 py-3.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20 hover:scale-105 active:scale-95 group"
                >
                  Explorar proyectos
                  <ArrowRight className="ml-2 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/dashboard"
                  className="inline-flex justify-center items-center px-8 py-3.5 bg-white text-gray-700 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  Ver desafíos
                </Link>
              </div>
            </div>
            <div className={`relative transition-all duration-700 delay-500 ${mounted ? 'opacity-100 translate-x-0 scale-100' : 'opacity-0 translate-x-10 scale-95'}`}>
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-cyan-50 rounded-2xl blur-3xl opacity-50 -z-10 animate-pulse-glow"></div>
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-2 overflow-hidden hover:shadow-3xl transition-shadow duration-500">
                {/* Interactive Circuit Hero */}
                <div className="bg-slate-50 rounded-xl aspect-[4/3] w-full h-full relative overflow-hidden shadow-inner border border-gray-200">
                  <HeroCircuit />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <AnimatedSection className="py-24 bg-slate-50" id="features">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Características principales</h2>
            <p className="text-gray-600">
              Todo lo que necesitas para aprender y crear circuitos lógicos, desde lo más básico hasta diseños avanzados.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Zap className="w-6 h-6 text-orange-500" />}
              title="Simulación en tiempo real"
              description="Ve los resultados instantáneamente mientras diseñas tus circuitos e interactúas con interruptores."
              color="bg-orange-50"
              delay={0}
            />
            <FeatureCard
              icon={<Target className="w-6 h-6 text-red-500" />}
              title="Desafíos progresivos"
              description="Aprende desde lo básico hasta circuitos complejos con un sistema de desafíos estructurados tipo 'Nand to Tetris'."
              color="bg-red-50"
              delay={100}
            />
            <FeatureCard
              icon={<Layers className="w-6 h-6 text-indigo-500" />}
              title="Componentes versátiles"
              description="Dispone de AND, OR, NOT, XOR, Relays, Latches y más para crear cualquier circuito digital imaginable."
              color="bg-indigo-50"
              delay={200}
            />
            <FeatureCard
              icon={<Share2 className="w-6 h-6 text-green-500" />}
              title="Visualización clara"
              description="Conexiones visuales y estados de componentes fáciles de entender con indicadores de color."
              color="bg-green-50"
              delay={300}
            />
            <FeatureCard
              icon={<Cpu className="w-6 h-6 text-purple-500" />}
              title="Guarda tus proyectos"
              description="Crea y organiza múltiples proyectos para explorar diferentes ideas y aprender a tu ritmo."
              color="bg-purple-50"
              delay={400}
            />
            <FeatureCard
              icon={<Moon className="w-6 h-6 text-yellow-500" />}
              title="Interfaz moderna"
              description="Interfaz cómoda y estética pensada para trabajar durante horas sin fatiga visual."
              color="bg-yellow-50"
              delay={500}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* How it Works Section */}
      <AnimatedSection className="py-24 bg-white" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Cómo empezar</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comienza tu viaje en la electrónica digital en cuatro sencillos pasos.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connector Line (Desktop) - Animated */}
            <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-200 -z-10 animate-pulse"></div>

            <StepCard
              number="1"
              title="Crea un proyecto"
              description="Comienza un nuevo proyecto desde el dashboard o elige un desafío."
              delay={0}
            />
            <StepCard
              number="2"
              title="Arrastra componentes"
              description="Selecciona compuertas lógicas e inputs/outputs de la barra lateral."
              delay={150}
            />
            <StepCard
              number="3"
              title="Conecta con wires"
              description="Crea conexiones entre componentes arrastrando desde los puertos."
              delay={300}
            />
            <StepCard
              number="4"
              title="Simula"
              description="Prueba tu circuito e interactúa con él para ver los resultados en vivo."
              delay={450}
            />
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <AnimatedSection className="py-20 bg-gradient-to-br from-blue-600 via-blue-600 to-cyan-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para comenzar?
          </h2>
          <p className="text-blue-100 text-lg mb-10 max-w-2xl mx-auto">
            Crea tu primer circuito lógico ahora mismo sin necesidad de registrarte. Explora el poder de la lógica digital.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              Ir al simulador
            </Link>
            <Link
              href="/dashboard"
              className="bg-blue-700/50 text-white border border-blue-400/50 px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 backdrop-blur-sm"
            >
              Explorar desafíos
            </Link>
          </div>
        </div>
      </AnimatedSection>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 group">
            <div className="bg-gray-100 p-1.5 rounded-lg transition-all duration-300 group-hover:bg-blue-100 group-hover:scale-110">
              <Cpu className="w-5 h-5 text-gray-600 transition-colors duration-300 group-hover:text-blue-600" />
            </div>
            <span className="text-lg font-bold text-gray-800">Gate Learning</span>
          </div>
          <p className="text-gray-500 text-sm">
            © 2026 Gate Learning. Aprende electrónica digital de forma interactiva.
          </p>
        </div>
      </footer>
    </div>
  );
}

// Animated Section wrapper component
function AnimatedSection({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) {
  const { ref, isVisible } = useIntersectionAnimation(0.1);

  return (
    <section
      ref={ref}
      id={id}
      className={`${className} transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
    >
      {children}
    </section>
  );
}

function FeatureCard({ icon, title, description, color, delay = 0 }: { icon: React.ReactNode, title: string, description: string, color: string, delay?: number }) {
  const { ref, isVisible } = useIntersectionAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`p-6 rounded-2xl bg-white border border-gray-100 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}

function StepCard({ number, title, description, delay = 0 }: { number: string, title: string, description: string, delay?: number }) {
  const { ref, isVisible } = useIntersectionAnimation(0.1);

  return (
    <div
      ref={ref}
      className={`relative bg-white p-6 pt-0 md:bg-transparent md:p-0 group transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      style={{ transitionDelay: isVisible ? `${delay}ms` : '0ms' }}
    >
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-6 shadow-lg shadow-blue-200 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-300 transition-all duration-300">
        {number}
      </div>
      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">{title}</h3>
      <p className="text-gray-600 text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
