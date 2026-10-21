import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Blog: React.FC = () => {
  const isLoggedIn = false;
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Blog de Salud</h1>
        <p className="mb-8">Artículos, novedades y consejos para pacientes y profesionales. Mejora tu salud con información confiable y actualizada.</p>
        {/* Aquí se listarán los artículos del blog */}
        <div className="bg-white rounded shadow p-6 mb-4">
          <h2 className="font-semibold text-xl mb-2">Cómo mejorar tu salud cardiovascular</h2>
          <p>Descubre hábitos y ejercicios recomendados para fortalecer tu corazón y prevenir enfermedades.</p>
        </div>
        <div className="bg-white rounded shadow p-6 mb-4">
          <h2 className="font-semibold text-xl mb-2">Errores comunes en la dieta para diabéticos</h2>
          <p>Evita los errores más frecuentes en la alimentación y aprende a controlar mejor tu glucosa.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
