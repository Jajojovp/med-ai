import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const PancreaticCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Pancreatic Cancer"
      subtitle="Malignant pancreatic tumor"
      description="Pancreatic cancer is an aggressive disease often diagnosed at advanced stages. Research and early diagnosis are essential."
      imageUrl="/images/pancreatic-cancer.jpg"
    >
      <h3>What is pancreatic cancer?</h3>
      <p>It is a malignant tumor that develops in the tissues of the pancreas, an organ key to digestion and glucose control.</p>
      <h3>Common symptoms</h3>
      <ul>
        <li>Weight loss</li>
        <li>Jaundice</li>
        <li>Abdominal pain</li>
        <li>Loss of appetite</li>
      </ul>
      <h3>Prevention</h3>
      <ul>
        <li>No smoking</li>
        <li>Healthy diet</li>
        <li>Control of chronic diseases</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/pancreatic-health">How to care for pancreatic health</a></li>
        <li><a href="/en/tips/prevent-pancreatic-cancer">Prevention of pancreatic cancer</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default PancreaticCancer;
