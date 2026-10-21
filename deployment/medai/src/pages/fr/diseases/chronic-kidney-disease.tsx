import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const ChronicKidneyDisease: React.FC = () => {
  return (
    <DiseaseArticle
      title="Maladie rénale chronique"
      subtitle="Perte progressive de la fonction rénale"
      description="La maladie rénale chronique est la perte progressive de la fonction des reins. Elle peut entraîner de graves complications si elle n'est pas détectée et traitée à temps."
      imageUrl="/images/chronic-kidney-disease.jpg"
    >
      <h3>Qu'est-ce que la maladie rénale chronique ?</h3>
      <p>C'est une affection dans laquelle les reins perdent leur capacité à filtrer les déchets et l'excès de liquides du sang.</p>
      <h3>Facteurs de risque</h3>
      <ul>
        <li>Diabète</li>
        <li>Hypertension</li>
        <li>Antécédents familiaux</li>
        <li>Âge avancé</li>
      </ul>
      <h3>Prévention</h3>
      <ul>
        <li>Contrôler la pression artérielle et la glycémie</li>
        <li>Éviter la consommation excessive de sel</li>
        <li>Hydratation adéquate</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/sante-renale">Comment prendre soin de la santé rénale</a></li>
        <li><a href="/fr/tips/alimentation-renale">Conseils alimentaires pour des reins sains</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default ChronicKidneyDisease;
