import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const HeartDisease: React.FC = () => {
  return (
    <DiseaseArticle
      title="Heart Disease"
      subtitle="Diseases of the heart"
      description="Heart diseases include a group of disorders that affect the structure and function of the heart. They are one of the leading causes of mortality worldwide."
      imageUrl="/images/heart-disease.jpg"
    >
      <h3>What are heart diseases?</h3>
      <p>They include coronary artery disease, heart failure, arrhythmias, and valvular diseases, among others.</p>
      <h3>Risk factors</h3>
      <ul>
        <li>High blood pressure</li>
        <li>High cholesterol</li>
        <li>Smoking</li>
        <li>Obesity</li>
        <li>Diabetes</li>
      </ul>
      <h3>Prevention</h3>
      <ul>
        <li>Healthy diet</li>
        <li>Regular exercise</li>
        <li>No smoking</li>
        <li>Regular medical check-ups</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/cardiovascular-health">How to improve your cardiovascular health</a></li>
        <li><a href="/en/tips/exercises-hypertension">Recommended exercises for hypertension</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default HeartDisease;
