import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const Leukemia: React.FC = () => {
  return (
    <DiseaseArticle
      title="Leucemia"
      subtitle="Cáncer de la sangre y médula ósea"
      description="La leucemia es un tipo de cáncer que afecta los glóbulos blancos. Puede presentarse en niños y adultos, y requiere diagnóstico y tratamiento especializado."
      imageUrl="/images/leukemia.jpg"
    >
      <h3>¿Qué es la leucemia?</h3>
      <p>Es un cáncer de los tejidos formadores de sangre, incluyendo la médula ósea y el sistema linfático.</p>
      <h3>Síntomas frecuentes</h3>
      <ul>
        <li>Fatiga</li>
        <li>Infecciones frecuentes</li>
        <li>Sangrados o hematomas</li>
        <li>Pérdida de peso</li>
      </ul>
      <h3>Prevención y control</h3>
      <ul>
        <li>Evitar exposición a radiación y químicos</li>
        <li>Control médico regular</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/salud-hematologica">Cómo cuidar la salud hematológica</a></li>
        <li><a href="/es/tips/prevencion-leucemia">Prevención de la leucemia</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Leukemia;
