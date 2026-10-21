import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const Epilepsy: React.FC = () => {
  return (
    <DiseaseArticle
      title="Epilepsia"
      subtitle="Trastorno neurológico crónico"
      description="La epilepsia es un trastorno cerebral que causa convulsiones recurrentes. El tratamiento adecuado permite llevar una vida normal en la mayoría de los casos."
      imageUrl="/images/epilepsy.jpg"
    >
      <h3>¿Qué es la epilepsia?</h3>
      <p>Es un trastorno neurológico caracterizado por la predisposición a generar crisis epilépticas recurrentes.</p>
      <h3>Síntomas y tipos de crisis</h3>
      <ul>
        <li>Convulsiones</li>
        <li>Pérdida de conciencia</li>
        <li>Movimientos involuntarios</li>
      </ul>
      <h3>Prevención y control</h3>
      <ul>
        <li>Adherencia al tratamiento</li>
        <li>Evitar factores desencadenantes</li>
        <li>Control médico regular</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/salud-neurologica">Cómo cuidar la salud neurológica</a></li>
        <li><a href="/es/tips/prevencion-epilepsia">Prevención de crisis epilépticas</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Epilepsy;
