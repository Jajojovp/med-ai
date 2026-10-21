import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const ChronicKidneyDisease: React.FC = () => {
  return (
    <DiseaseArticle
      title="Enfermedad Renal Crónica"
      subtitle="Deterioro progresivo de la función renal"
      description="La enfermedad renal crónica es la pérdida gradual de la función de los riñones. Puede llevar a complicaciones graves si no se detecta y trata a tiempo."
      imageUrl="/images/chronic-kidney-disease.jpg"
    >
      <h3>¿Qué es la enfermedad renal crónica?</h3>
      <p>Es una afección en la que los riñones pierden su capacidad para filtrar desechos y exceso de líquidos de la sangre.</p>
      <h3>Factores de riesgo</h3>
      <ul>
        <li>Diabetes</li>
        <li>Hipertensión</li>
        <li>Antecedentes familiares</li>
        <li>Edad avanzada</li>
      </ul>
      <h3>Prevención</h3>
      <ul>
        <li>Controlar la presión arterial y glucosa</li>
        <li>Evitar el consumo excesivo de sal</li>
        <li>Hidratación adecuada</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/salud-renal">Cómo cuidar la salud renal</a></li>
        <li><a href="/es/tips/alimentacion-renal">Consejos alimenticios para riñones sanos</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default ChronicKidneyDisease;
