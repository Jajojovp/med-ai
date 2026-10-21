import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const StomachCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Stomach Cancer"
      subtitle="Malignant gastric tumor"
      description="Stomach cancer is a disease in which malignant cells form in the tissues of the stomach. Early detection is key for treatment."
      imageUrl="/images/stomach-cancer.jpg"
    >
      <h3>What is stomach cancer?</h3>
      <p>It is a tumor that develops in the inner lining of the stomach and can spread to other organs.</p>
      <h3>Common symptoms</h3>
      <ul>
        <li>Persistent indigestion</li>
        <li>Loss of appetite</li>
        <li>Weight loss</li>
        <li>Digestive bleeding</li>
      </ul>
      <h3>Prevention</h3>
      <ul>
        <li>Diet rich in fruits and vegetables</li>
        <li>Avoid tobacco and alcohol</li>
        <li>Control of gastric infections</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/gastric-health">How to care for gastric health</a></li>
        <li><a href="/en/tips/prevent-stomach-cancer">Prevention of stomach cancer</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default StomachCancer;
