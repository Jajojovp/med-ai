import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface DiseasePageProps {
  isLoggedIn?: boolean;
  title: string;
  description: string;
  children?: React.ReactNode;
}

const DiseasePage: React.FC<DiseasePageProps> = ({ isLoggedIn = false, title, description, children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="mb-8 text-lg">{description}</p>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DiseasePage;
