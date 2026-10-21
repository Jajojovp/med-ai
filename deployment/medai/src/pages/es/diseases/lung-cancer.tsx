import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const LungCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cáncer de Pulmón"
      subtitle="Tumor maligno del tejido pulmonar"
      description="El cáncer de pulmón es una de las principales causas de muerte por cáncer en el mundo. Su detección temprana es clave para mejorar el pronóstico."
      imageUrl="/images/lung-cancer.jpg"
    >
      <h3>¿Qué es el cáncer de pulmón?</h3>
      <p>Es un tumor maligno que se origina en los pulmones, generalmente asociado al tabaquismo, aunque puede afectar a no fumadores.</p>
      <h3>Síntomas frecuentes</h3>
      <ul>
        <li>Tos persistente</li>
        <li>Dolor torácico</li>
        <li>Pérdida de peso</li>
        <li>Dificultad para respirar</li>
      </ul>
      <h3>Prevención</h3>
      <ul>
        <li>No fumar</li>
        <li>Evitar exposición a contaminantes</li>
        <li>Chequeos médicos regulares</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/salud-pulmonar">Cómo mejorar la salud pulmonar</a></li>
        <li><a href="/es/tips/prevencion-cancer-pulmon">Prevención del cáncer de pulmón</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default LungCancer;
