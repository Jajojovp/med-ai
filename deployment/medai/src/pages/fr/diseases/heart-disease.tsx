import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const HeartDisease: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cardiopathies"
      subtitle="Maladies du cœur"
      description="Les cardiopathies regroupent un ensemble de troubles affectant la structure et la fonction du cœur. Elles constituent l'une des principales causes de mortalité dans le monde."
      imageUrl="/images/heart-disease.jpg"
    >
      <h3>Qu'est-ce que les cardiopathies ?</h3>
      <p>Elles incluent les maladies coronariennes, l'insuffisance cardiaque, les arythmies et les valvulopathies, entre autres.</p>
      <h3>Facteurs de risque</h3>
      <ul>
        <li>Hypertension artérielle</li>
        <li>Cholestérol élevé</li>
        <li>Tabagisme</li>
        <li>Obésité</li>
        <li>Diabète</li>
      </ul>
      <h3>Prévention</h3>
      <ul>
        <li>Alimentation saine</li>
        <li>Exercice régulier</li>
        <li>Ne pas fumer</li>
        <li>Contrôle médical périodique</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/sante-cardiovasculaire">Comment améliorer votre santé cardiovasculaire</a></li>
        <li><a href="/fr/tips/exercices-hypertension">Exercices recommandés pour l'hypertension</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default HeartDisease;
