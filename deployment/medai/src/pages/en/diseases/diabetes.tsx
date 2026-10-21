import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const Diabetes: React.FC = () => {
  return (
    <DiseaseArticle
      title="Diabetes Mellitus"
      subtitle="Chronic metabolic disease"
      description="Diabetes is a chronic disease that affects how the body turns food into energy. It can cause serious complications if not properly managed."
      imageUrl="/images/diabetes.jpg"
    >
      <h3>What is diabetes?</h3>
      <p>Diabetes mellitus is a group of metabolic diseases characterized by chronic hyperglycemia, resulting from defects in insulin secretion or action.</p>
      <h3>Main types</h3>
      <ul>
        <li><b>Type 1:</b> The body does not produce insulin.</li>
        <li><b>Type 2:</b> The body does not use insulin properly.</li>
        <li>Gestational: Occurs during pregnancy.</li>
      </ul>
      <h3>Common symptoms</h3>
      <ul>
        <li>Excessive thirst</li>
        <li>Frequent urination</li>
        <li>Unexplained weight loss</li>
        <li>Fatigue</li>
      </ul>
      <h3>Prevention and tips</h3>
      <ul>
        <li>Maintain a balanced diet</li>
        <li>Engage in regular physical activity</li>
        <li>Control body weight</li>
        <li>Avoid excessive sugar intake</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/common-mistakes-diabetic-diet">Common mistakes in the diabetic diet</a></li>
        <li><a href="/en/tips/physical-activity-diabetes">Recommended physical activity for diabetes</a></li>
        <li><a href="/en/tips/preventive-health-diabetes">Preventive health in diabetes</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Diabetes;
