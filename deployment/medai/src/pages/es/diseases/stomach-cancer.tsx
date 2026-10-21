import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const StomachCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cáncer de Estómago"
      subtitle="Tumor maligno gástrico"
      description="El cáncer de estómago es una enfermedad en la que se forman células malignas en los tejidos del estómago. Su detección temprana es clave para el tratamiento."
      imageUrl="/images/stomach-cancer.jpg"
    >
      <h3>¿Qué es el cáncer de estómago?</h3>
      <p>Es un tumor que se desarrolla en el revestimiento interno del estómago y puede diseminarse a otros órganos.</p>
      <h3>Síntomas frecuentes</h3>
      <ul>
        <li>Indigestión persistente</li>
        <li>Pérdida de apetito</li>
        <li>Pérdida de peso</li>
        <li>Sangrado digestivo</li>
      </ul>
      <h3>Prevención</h3>
      <ul>
        <li>Dieta rica en frutas y verduras</li>
        <li>Evitar el tabaco y alcohol</li>
        <li>Control de infecciones gástricas</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/salud-gastrica">Cómo cuidar la salud gástrica</a></li>
        <li><a href="/es/tips/prevencion-cancer-estomago">Prevención del cáncer de estómago</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default StomachCancer;
