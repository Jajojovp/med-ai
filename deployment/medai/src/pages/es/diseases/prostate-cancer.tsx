import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const ProstateCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cáncer de Próstata"
      subtitle="Tumor maligno de la glándula prostática"
      description="El cáncer de próstata es uno de los más frecuentes en hombres adultos. La detección temprana y el seguimiento médico son fundamentales para un buen pronóstico."
      imageUrl="/images/prostate-cancer.jpg"
    >
      <h3>¿Qué es el cáncer de próstata?</h3>
      <p>Es un tumor maligno que se desarrolla en la glándula prostática. Puede crecer lentamente y, en algunos casos, no causar síntomas en etapas iniciales.</p>
      <h3>Síntomas y factores de riesgo</h3>
      <ul>
        <li>Dificultad para orinar</li>
        <li>Flujo de orina débil</li>
        <li>Antecedentes familiares</li>
        <li>Edad avanzada</li>
      </ul>
      <h3>Prevención y diagnóstico</h3>
      <ul>
        <li>Exámenes médicos regulares (PSA, tacto rectal)</li>
        <li>Estilo de vida saludable</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/salud-prostatica">Cómo cuidar la salud prostática</a></li>
        <li><a href="/es/tips/prevencion-cancer-prostata">Prevención del cáncer de próstata</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default ProstateCancer;
