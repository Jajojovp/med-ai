import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const Epilepsy: React.FC = () => {
  return (
    <DiseaseArticle
      title="Epilepsy"
      subtitle="Chronic neurological disorder"
      description="Epilepsy is a brain disorder that causes recurrent seizures. Proper treatment allows most people to live normal lives."
      imageUrl="/images/epilepsy.jpg"
    >
      <h3>What is epilepsy?</h3>
      <p>It is a neurological disorder characterized by a predisposition to generate recurrent epileptic seizures.</p>
      <h3>Symptoms and types of seizures</h3>
      <ul>
        <li>Seizures</li>
        <li>Loss of consciousness</li>
        <li>Involuntary movements</li>
      </ul>
      <h3>Prevention and control</h3>
      <ul>
        <li>Adherence to treatment</li>
        <li>Avoiding triggers</li>
        <li>Regular medical check-ups</li>
      </ul>
      <h3>Related articles</h3>
      <ul>
        <li><a href="/en/tips/neurologic-health">How to care for neurologic health</a></li>
        <li><a href="/en/tips/prevent-epilepsy">Prevention of epileptic seizures</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Epilepsy;
