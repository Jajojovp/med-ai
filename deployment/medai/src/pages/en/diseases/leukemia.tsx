import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const Leukemia: React.FC = () => {
  return (
    <DiseaseArticle
      title="Leukemia"
      subtitle="Cancer of the blood and bone marrow"
      description="Leukemia is a type of cancer that affects white blood cells. It can occur in both children and adults and requires specialized diagnosis and treatment."
      imageUrl="/images/leukemia.jpg"
    >
      <h3>What is leukemia?</h3>
      <p>It is a cancer of the blood-forming tissues, including the bone marrow and lymphatic system.</p>
      <h3>Common symptoms</h3>
      <ul>
        <li>Fatigue</li>
        <li>Frequent infections</li>
        <li>Bleeding or bruising</li>
        <li>Weight loss</li>
      </ul>
      <h3>Prevention and control</h3>
      <ul>
        <li>Avoid exposure to radiation and chemicals</li>
        <li>Regular medical check-ups</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/hematologic-health">How to care for hematologic health</a></li>
        <li><a href="/en/tips/prevent-leukemia">Prevention of leukemia</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Leukemia;
