import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const LiverCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Liver Cancer"
      subtitle="Malignant liver tumor"
      description="Liver cancer is a disease in which malignant cells form in the liver tissues. It is often associated with chronic hepatitis or cirrhosis."
      imageUrl="/images/liver-cancer.jpg"
    >
      <h3>What is liver cancer?</h3>
      <p>It is a tumor that originates in the liver cells, with hepatocellular carcinoma being the most common type.</p>
      <h3>Common symptoms</h3>
      <ul>
        <li>Weight loss</li>
        <li>Jaundice</li>
        <li>Abdominal pain</li>
        <li>Fatigue</li>
      </ul>
      <h3>Prevention</h3>
      <ul>
        <li>Hepatitis B vaccination</li>
        <li>Avoid excessive alcohol consumption</li>
        <li>Control of liver diseases</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/liver-health">How to care for liver health</a></li>
        <li><a href="/en/tips/prevent-liver-cancer">Prevention of liver cancer</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default LiverCancer;
