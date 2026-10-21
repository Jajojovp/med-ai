import React from 'react';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

interface DiseaseArticleProps {
  isLoggedIn?: boolean;
  title: string;
  subtitle?: string;
  description: string;
  imageUrl?: string;
  children?: React.ReactNode;
}

const DiseaseArticle: React.FC<DiseaseArticleProps> = ({
  isLoggedIn = false,
  title,
  subtitle,
  description,
  imageUrl,
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1 max-w-4xl mx-auto py-12 px-4">
        <div className="flex flex-col md:flex-row gap-8 items-center mb-8">
          {imageUrl && (
            <img src={imageUrl} alt={title} className="w-40 h-40 object-cover rounded-lg shadow" />
          )}
          <div>
            <h1 className="text-3xl font-bold mb-2">{title}</h1>
            {subtitle && <h2 className="text-xl text-blue-700 mb-2">{subtitle}</h2>}
            <p className="mb-4 text-lg text-gray-700">{description}</p>
          </div>
        </div>
        <section className="prose max-w-none">
          {children}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DiseaseArticle;
