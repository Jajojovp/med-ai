import React, { useState } from 'react';

const ChatBot: React.FC = () => {
  const [messages, setMessages] = useState([
    { sender: 'ai', text: '¡Hola! Soy tu asistente médico. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { sender: 'user', text: input }]);
    // Aquí se integraría la llamada a n8n/backend para obtener la respuesta AI
    setTimeout(() => {
      setMessages(msgs => [...msgs, { sender: 'ai', text: 'Esta es una respuesta simulada del chatbot médico.' }]);
    }, 1000);
    setInput('');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow-sm px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="MedAI Logo" className="h-8 w-8" />
          <span className="font-bold text-xl">MedAI <span className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs align-top ml-1">Pro</span></span>
        </div>
        <nav className="flex items-center gap-6">
          <a href="/dashboard" className="nav-link">Dashboard</a>
          <a href="/chat-ai" className="nav-link font-semibold">Chat AI Médico</a>
          <a href="/es/diseases" className="nav-link">Análisis Médicos</a>
          <a href="/es/blog" className="nav-link">Blog</a>
          <a href="/es/tips" className="nav-link">Consejos</a>
          <a href="/es/contact" className="nav-link">Contacto</a>
          <button className="ml-4 bg-gray-200 text-gray-800 px-4 py-2 rounded-full">Cerrar sesión</button>
        </nav>
      </header>
      <main className="flex-1 max-w-3xl mx-auto py-12 px-4 flex flex-col">
        <h1 className="text-3xl font-bold mb-6">Chatbot Médico Inteligente</h1>
        <div className="flex-1 bg-white rounded shadow p-6 mb-4 overflow-y-auto" style={{ minHeight: 300 }}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`mb-3 flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-700'}`}>{msg.text}</div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-3 py-2"
            placeholder="Escribe tu pregunta..."
            value={input}
            onChange={e => setInput(e.target.value)}
            required
          />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full">Enviar</button>
        </form>
      </main>
      <footer className="footer bg-gray-900 text-white py-8 px-8 mt-12">
        <div className="text-center text-gray-400 text-xs mt-8 border-t border-gray-800 pt-4">
          © 2024 MedAI. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  );
};

export default ChatBot;
