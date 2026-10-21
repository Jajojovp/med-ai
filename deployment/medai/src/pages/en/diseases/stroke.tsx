import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const Stroke: React.FC = () => {
  return (
    <DiseaseArticle
      title="Stroke (Cerebrovascular Accident)"
      subtitle="Interruption of cerebral blood flow"
      description="Stroke is a medical emergency that requires immediate attention. Prevention and timely treatment save lives and reduce sequelae."
      imageUrl="/images/stroke.jpg"
    >
      <h3>What is a stroke?</h3>
      <p>It is the sudden interruption of blood flow to the brain, which can cause permanent brain damage.</p>
      <h3>Warning signs</h3>
      <ul>
        <li>Weakness or paralysis on one side of the body</li>
        <li>Difficulty speaking or understanding</li>
        <li>Loss of vision</li>
        <li>Severe headache</li>
      </ul>
      <h3>Prevention</h3>
      <ul>
        <li>Blood pressure control</li>
        <li>Healthy diet</li>
        <li>Regular physical activity</li>
        <li>No smoking</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/cerebrovascular-health">How to prevent a stroke</a></li>
        <li><a href="/en/tips/stroke-recovery">Recovery after a stroke</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Stroke;
