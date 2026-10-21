import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const Leukemia: React.FC = () => {
  return (
    <DiseaseArticle
      title="Leucémie"
      subtitle="Cancer du sang et de la moelle osseuse"
      description="La leucémie est un type de cancer qui affecte les globules blancs. Elle peut toucher les enfants et les adultes et nécessite un diagnostic et un traitement spécialisés."
      imageUrl="/images/leukemia.jpg"
    >
      <h3>Qu'est-ce que la leucémie ?</h3>
      <p>C'est un cancer des tissus formateurs du sang, y compris la moelle osseuse et le système lymphatique.</p>
      <h3>Symptômes fréquents</h3>
      <ul>
        <li>Fatigue</li>
        <li>Infections fréquentes</li>
        <li>Saignements ou ecchymoses</li>
        <li>Perte de poids</li>
      </ul>
      <h3>Prévention et contrôle</h3>
      <ul>
        <li>Éviter l'exposition aux radiations et aux produits chimiques</li>
        <li>Contrôles médicaux réguliers</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/sante-hematologique">Comment prendre soin de la santé hématologique</a></li>
        <li><a href="/fr/tips/prevention-leucemie">Prévention de la leucémie</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Leukemia;
