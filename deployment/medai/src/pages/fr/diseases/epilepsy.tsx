import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const Epilepsy: React.FC = () => {
  return (
    <DiseaseArticle
      title="Épilepsie"
      subtitle="Trouble neurologique chronique"
      description="L'épilepsie est un trouble cérébral qui provoque des crises récurrentes. Un traitement approprié permet à la plupart des personnes de mener une vie normale."
      imageUrl="/images/epilepsy.jpg"
    >
      <h3>Qu'est-ce que l'épilepsie ?</h3>
      <p>C'est un trouble neurologique caractérisé par une prédisposition à générer des crises épileptiques récurrentes.</p>
      <h3>Symptômes et types de crises</h3>
      <ul>
        <li>Crises convulsives</li>
        <li>Perte de conscience</li>
        <li>Mouvements involontaires</li>
      </ul>
      <h3>Prévention et contrôle</h3>
      <ul>
        <li>Adhésion au traitement</li>
        <li>Éviter les facteurs déclenchants</li>
        <li>Contrôles médicaux réguliers</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/sante-neurologique">Comment prendre soin de la santé neurologique</a></li>
        <li><a href="/fr/tips/prevention-epilepsie">Prévention des crises épileptiques</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Epilepsy;
