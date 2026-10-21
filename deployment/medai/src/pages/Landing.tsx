import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Landing: React.FC = () => {
  // Simulación de estado de sesión (reemplazar por contexto real de autenticación)
  const isLoggedIn = false;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-4xl font-bold mb-4">Bienvenido a MedAI Insight Agent</h1>
        <p className="text-lg mb-8">Plataforma avanzada de asistencia médica con IA, análisis predictivo y contenido educativo en salud. Explora enfermedades, consejos, blog y accede a herramientas exclusivas para médicos.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded shadow p-6">
            <h2 className="font-semibold text-xl mb-2">Análisis Médicos</h2>
            <p>Descubre predicciones y análisis personalizados para enfermedades clave usando modelos de IA.</p>
          </div>
          <div className="bg-white rounded shadow p-6">
            <h2 className="font-semibold text-xl mb-2">Blog y Consejos</h2>
            <p>Lee artículos, recomendaciones y guías prácticas para mejorar tu salud y prevenir enfermedades.</p>
          </div>
          <div className="bg-white rounded shadow p-6">
            <h2 className="font-semibold text-xl mb-2">Dashboard Médico</h2>
            <p>Acceso exclusivo para doctores: chatbot inteligente, reportes automáticos y gestión de pacientes.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Landing;
