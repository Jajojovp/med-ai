import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const ChronicKidneyDisease: React.FC = () => {
  return (
    <DiseaseArticle
      title="Chronic Kidney Disease"
      subtitle="Progressive loss of kidney function"
      description="Chronic kidney disease is the gradual loss of kidney function. It can lead to serious complications if not detected and treated early."
      imageUrl="/images/chronic-kidney-disease.jpg"
    >
      <h3>What is chronic kidney disease?</h3>
      <p>It is a condition in which the kidneys lose their ability to filter waste and excess fluids from the blood.</p>
      <h3>Risk factors</h3>
      <ul>
        <li>Diabetes</li>
        <li>High blood pressure</li>
        <li>Family history</li>
        <li>Advanced age</li>
      </ul>
      <h3>Prevention</h3>
      <ul>
        <li>Control blood pressure and glucose</li>
        <li>Avoid excessive salt intake</li>
        <li>Proper hydration</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/kidney-health">How to care for kidney health</a></li>
        <li><a href="/en/tips/kidney-nutrition">Nutritional tips for healthy kidneys</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default ChronicKidneyDisease;
