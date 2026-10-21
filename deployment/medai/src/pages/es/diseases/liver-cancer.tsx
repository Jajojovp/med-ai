import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const LiverCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cáncer de Hígado"
      subtitle="Tumor maligno hepático"
      description="El cáncer de hígado es una enfermedad en la que se forman células malignas en los tejidos hepáticos. Suele estar asociado a hepatitis crónica o cirrosis."
      imageUrl="/images/liver-cancer.jpg"
    >
      <h3>¿Qué es el cáncer de hígado?</h3>
      <p>Es un tumor que se origina en las células del hígado, siendo el carcinoma hepatocelular el tipo más común.</p>
      <h3>Síntomas frecuentes</h3>
      <ul>
        <li>Pérdida de peso</li>
        <li>Ictericia</li>
        <li>Dolor abdominal</li>
        <li>Fatiga</li>
      </ul>
      <h3>Prevención</h3>
      <ul>
        <li>Vacunación contra hepatitis B</li>
        <li>Evitar consumo excesivo de alcohol</li>
        <li>Control de enfermedades hepáticas</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/salud-hepatica">Cómo cuidar la salud hepática</a></li>
        <li><a href="/es/tips/prevencion-cancer-higado">Prevención del cáncer de hígado</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default LiverCancer;
