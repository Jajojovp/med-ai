import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Contact: React.FC = () => {
  const isLoggedIn = false;
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 max-w-3xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-6">Contacto</h1>
        <p className="mb-8">¿Tienes dudas, sugerencias o necesitas soporte? Completa el formulario y nuestro equipo te responderá pronto.</p>
        <form className="bg-white rounded shadow p-6 flex flex-col gap-4">
          <input type="text" placeholder="Nombre" className="border rounded px-3 py-2" required />
          <input type="email" placeholder="Correo electrónico" className="border rounded px-3 py-2" required />
          <textarea placeholder="Mensaje" className="border rounded px-3 py-2" rows={4} required />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full mt-2">Enviar</button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
