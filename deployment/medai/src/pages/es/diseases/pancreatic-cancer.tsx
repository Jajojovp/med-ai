import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const PancreaticCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cáncer de Páncreas"
      subtitle="Tumor maligno pancreático"
      description="El cáncer de páncreas es una enfermedad agresiva que suele diagnosticarse en etapas avanzadas. La investigación y el diagnóstico temprano son fundamentales."
      imageUrl="/images/pancreatic-cancer.jpg"
    >
      <h3>¿Qué es el cáncer de páncreas?</h3>
      <p>Es un tumor maligno que se desarrolla en los tejidos del páncreas, órgano clave en la digestión y el control de la glucosa.</p>
      <h3>Síntomas frecuentes</h3>
      <ul>
        <li>Pérdida de peso</li>
        <li>Ictericia</li>
        <li>Dolor abdominal</li>
        <li>Pérdida de apetito</li>
      </ul>
      <h3>Prevención</h3>
      <ul>
        <li>No fumar</li>
        <li>Alimentación saludable</li>
        <li>Control de enfermedades crónicas</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/salud-pancreatica">Cómo cuidar la salud pancreática</a></li>
        <li><a href="/es/tips/prevencion-cancer-pancreas">Prevención del cáncer de páncreas</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default PancreaticCancer;
