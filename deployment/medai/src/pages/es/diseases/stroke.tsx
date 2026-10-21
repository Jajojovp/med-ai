import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const Stroke: React.FC = () => {
  return (
    <DiseaseArticle
      title="Accidente Cerebrovascular (Stroke)"
      subtitle="Interrupción del flujo sanguíneo cerebral"
      description="El accidente cerebrovascular es una emergencia médica que requiere atención inmediata. La prevención y el tratamiento oportuno salvan vidas y reducen secuelas."
      imageUrl="/images/stroke.jpg"
    >
      <h3>¿Qué es un accidente cerebrovascular?</h3>
      <p>Es la interrupción repentina del flujo sanguíneo al cerebro, lo que puede causar daño cerebral permanente.</p>
      <h3>Síntomas de alerta</h3>
      <ul>
        <li>Debilidad o parálisis en un lado del cuerpo</li>
        <li>Dificultad para hablar o entender</li>
        <li>Pérdida de visión</li>
        <li>Dolor de cabeza intenso</li>
      </ul>
      <h3>Prevención</h3>
      <ul>
        <li>Control de presión arterial</li>
        <li>Alimentación saludable</li>
        <li>Actividad física regular</li>
        <li>No fumar</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/salud-cerebrovascular">Cómo prevenir un accidente cerebrovascular</a></li>
        <li><a href="/es/tips/recuperacion-stroke">Recuperación tras un stroke</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Stroke;
