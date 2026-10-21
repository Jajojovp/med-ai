import React from 'react';

const Navigation = ({ activeView, setActiveView }) => (
  <nav className="flex justify-center gap-6 py-4 bg-white/80 shadow-sm rounded-b-3xl mb-8">
    <button
      className={`px-4 py-2 rounded-full font-semibold ${activeView === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-blue-50'}`}
      onClick={() => setActiveView('dashboard')}
    >
      Dashboard
    </button>
    <button
      className={`px-4 py-2 rounded-full font-semibold ${activeView === 'chat' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-purple-50'}`}
      onClick={() => setActiveView('chat')}
    >
      Chat AI
    </button>
    <button
      className={`px-4 py-2 rounded-full font-semibold ${activeView === 'admin' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-green-50'}`}
      onClick={() => setActiveView('admin')}
    >
      Admin
    </button>
  </nav>
);

export default Navigation;
