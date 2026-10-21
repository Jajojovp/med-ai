import React from 'react';
import DiseaseArticle from './DiseaseArticle';

const Diabetes: React.FC = () => {
  return (
    <DiseaseArticle
      title="Diabetes Mellitus"
      subtitle="Enfermedad metabólica crónica"
      description="La diabetes es una enfermedad crónica que afecta la forma en que el cuerpo convierte los alimentos en energía. Puede causar complicaciones graves si no se controla adecuadamente."
      imageUrl="/images/diabetes.jpg"
    >
      <h3>¿Qué es la diabetes?</h3>
      <p>La diabetes mellitus es un grupo de enfermedades metabólicas caracterizadas por hiperglucemia crónica, resultado de defectos en la secreción o acción de la insulina.</p>
      <h3>Tipos principales</h3>
      <ul>
        <li><b>Tipo 1:</b> El cuerpo no produce insulina.</li>
        <li><b>Tipo 2:</b> El cuerpo no usa la insulina adecuadamente.</li>
        <li><b>Gestacional:</b> Aparece durante el embarazo.</li>
      </ul>
      <h3>Síntomas comunes</h3>
      <ul>
        <li>Sed excesiva</li>
        <li>Micción frecuente</li>
        <li>Pérdida de peso inexplicada</li>
        <li>Fatiga</li>
      </ul>
      <h3>Prevención y consejos</h3>
      <ul>
        <li>Mantener una dieta equilibrada</li>
        <li>Realizar actividad física regular</li>
        <li>Controlar el peso corporal</li>
        <li>Evitar el consumo excesivo de azúcares</li>
      </ul>
      <h3>Artículos relacionados</h3>
      <ul>
        <li><a href="/es/tips/errores-dieta-diabeticos">Errores comunes en la dieta para diabéticos</a></li>
        <li><a href="/es/tips/actividad-fisica-diabetes">Actividad física recomendada para diabetes</a></li>
        <li><a href="/es/tips/salud-preventiva-diabetes">Salud preventiva en diabetes</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Diabetes;
