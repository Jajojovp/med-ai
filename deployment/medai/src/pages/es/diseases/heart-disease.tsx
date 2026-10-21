import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const HeartDisease: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cardiopatías"
      subtitle="Enfermedades del corazón"
      description="Las cardiopatías comprenden un grupo de trastornos que afectan la estructura y función del corazón. Son una de las principales causas de mortalidad a nivel mundial."
      imageUrl="/images/heart-disease.jpg"
    >
      <h3>¿Qué son las cardiopatías?</h3>
      <p>Incluyen enfermedades coronarias, insuficiencia cardíaca, arritmias y valvulopatías, entre otras.</p>
      <h3>Factores de riesgo</h3>
      <ul>
        <li>Hipertensión arterial</li>
        <li>Colesterol alto</li>
        <li>Tabaquismo</li>
        <li>Obesidad</li>
        <li>Diabetes</li>
      </ul>
      <h3>Prevención</h3>
      <ul>
        <li>Alimentación saludable</li>
        <li>Ejercicio regular</li>
        <li>No fumar</li>
        <li>Control médico periódico</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/salud-cardiovascular">Cómo mejorar tu salud cardiovascular</a></li>
        <li><a href="/es/tips/ejercicios-hipertension">Ejercicios recomendados para hipertensión</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default HeartDisease;
