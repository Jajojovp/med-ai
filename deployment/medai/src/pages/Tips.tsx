import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Tips: React.FC = () => {
  const isLoggedIn = false;
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 max-w-5xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Consejos de Salud</h1>
        <p className="mb-8">Recomendaciones prácticas para prevenir enfermedades y mejorar tu bienestar diario.</p>
        {/* Ejemplo de consejos */}
        <div className="bg-white rounded shadow p-6 mb-4">
          <h2 className="font-semibold text-xl mb-2">Qué hacer si tienes factores de riesgo genético</h2>
          <p>Aprende a identificar y gestionar los factores de riesgo hereditarios para distintas enfermedades.</p>
        </div>
        <div className="bg-white rounded shadow p-6 mb-4">
          <h2 className="font-semibold text-xl mb-2">Ejercicios recomendados para hipertensión</h2>
          <p>Rutinas y actividades físicas seguras para controlar la presión arterial.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Tips;
