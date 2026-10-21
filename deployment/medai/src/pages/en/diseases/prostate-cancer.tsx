import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const ProstateCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Prostate Cancer"
      subtitle="Malignant tumor of the prostate gland"
      description="Prostate cancer is one of the most common cancers in adult men. Early detection and medical follow-up are essential for a good prognosis."
      imageUrl="/images/prostate-cancer.jpg"
    >
      <h3>What is prostate cancer?</h3>
      <p>It is a malignant tumor that develops in the prostate gland. It can grow slowly and, in some cases, cause no symptoms in early stages.</p>
      <h3>Symptoms and risk factors</h3>
      <ul>
        <li>Difficulty urinating</li>
        <li>Weak urine flow</li>
        <li>Family history</li>
        <li>Advanced age</li>
      </ul>
      <h3>Prevention and diagnosis</h3>
      <ul>
        <li>Regular medical exams (PSA, digital rectal exam)</li>
        <li>Healthy lifestyle</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/prostate-health">How to care for prostate health</a></li>
        <li><a href="/en/tips/prevent-prostate-cancer">Prevention of prostate cancer</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default ProstateCancer;
