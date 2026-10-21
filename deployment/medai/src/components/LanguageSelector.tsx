import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  return (
    <div className="language-selector" role="group" aria-label="Select language">
      <button type="button" aria-pressed={language === 'es'} onClick={() => setLanguage('es')}>ES</button>
      <button type="button" aria-pressed={language === 'en'} onClick={() => setLanguage('en')}>EN</button>
      <button type="button" aria-pressed={language === 'fr'} onClick={() => setLanguage('fr')}>FR</button>
    </div>
  );
};

export default LanguageSelector;
