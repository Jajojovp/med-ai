import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const BreastCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Breast Cancer"
      subtitle="Malignant tumor of the mammary gland"
      description="Breast cancer is the most common type of cancer in women. Early detection and timely treatment significantly improve the prognosis."
      imageUrl="/images/breast-cancer.jpg"
    >
      <h3>What is breast cancer?</h3>
      <p>It is a malignant tumor that originates in the cells of the mammary gland. It can spread to other organs if not treated in time.</p>
      <h3>Warning signs</h3>
      <ul>
        <li>Lump or mass in the breast</li>
        <li>Changes in skin or nipple</li>
        <li>Abnormal discharge</li>
      </ul>
      <h3>Prevention and detection</h3>
      <ul>
        <li>Monthly breast self-exam</li>
        <li>Annual mammogram from age 40</li>
        <li>Healthy lifestyle</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/preventive-health-breast-cancer">Preventive health in breast cancer</a></li>
        <li><a href="/en/tips/physical-activity-breast-cancer">Recommended physical activity</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default BreastCancer;
