import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const BreastCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cáncer de Mama"
      subtitle="Tumor maligno de la glándula mamaria"
      description="El cáncer de mama es el tipo de cáncer más frecuente en mujeres. La detección temprana y el tratamiento oportuno mejoran significativamente el pronóstico."
      imageUrl="/images/breast-cancer.jpg"
    >
      <h3>¿Qué es el cáncer de mama?</h3>
      <p>Es un tumor maligno que se origina en las células de la glándula mamaria. Puede diseminarse a otros órganos si no se trata a tiempo.</p>
      <h3>Síntomas de alerta</h3>
      <ul>
        <li>Bulto o masa en la mama</li>
        <li>Cambios en la piel o pezón</li>
        <li>Secreción anormal</li>
      </ul>
      <h3>Prevención y detección</h3>
      <ul>
        <li>Autoexploración mamaria mensual</li>
        <li>Mamografía anual a partir de los 40 años</li>
        <li>Estilo de vida saludable</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/salud-preventiva-cancer-mama">Salud preventiva en cáncer de mama</a></li>
        <li><a href="/es/tips/actividad-fisica-cancer-mama">Actividad física recomendada</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default BreastCancer;
