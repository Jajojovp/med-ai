import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const LungCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Lung Cancer"
      subtitle="Malignant tumor of lung tissue"
      description="Lung cancer is one of the leading causes of cancer death worldwide. Early detection is key to improving prognosis."
      imageUrl="/images/lung-cancer.jpg"
    >
      <h3>What is lung cancer?</h3>
      <p>It is a malignant tumor that originates in the lungs, usually associated with smoking, although it can affect non-smokers.</p>
      <h3>Common symptoms</h3>
      <ul>
        <li>Persistent cough</li>
        <li>Chest pain</li>
        <li>Weight loss</li>
        <li>Shortness of breath</li>
      </ul>
      <h3>Prevention</h3>
      <ul>
        <li>No smoking</li>
        <li>Avoid exposure to pollutants</li>
        <li>Regular medical check-ups</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/lung-health">How to improve lung health</a></li>
        <li><a href="/en/tips/prevent-lung-cancer">Prevention of lung cancer</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default LungCancer;
