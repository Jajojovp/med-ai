import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const LiverCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cancer du foie"
      subtitle="Tumeur maligne hépatique"
      description="Le cancer du foie est une maladie dans laquelle des cellules malignes se forment dans les tissus hépatiques. Il est souvent associé à une hépatite chronique ou à une cirrhose."
      imageUrl="/images/liver-cancer.jpg"
    >
      <h3>Qu'est-ce que le cancer du foie ?</h3>
      <p>C'est une tumeur qui prend naissance dans les cellules du foie, le carcinome hépatocellulaire étant le type le plus courant.</p>
      <h3>Symptômes fréquents</h3>
      <ul>
        <li>Perte de poids</li>
        <li>Ictère</li>
        <li>Douleur abdominale</li>
        <li>Fatigue</li>
      </ul>
      <h3>Prévention</h3>
      <ul>
        <li>Vaccination contre l'hépatite B</li>
        <li>Éviter la consommation excessive d'alcool</li>
        <li>Contrôle des maladies hépatiques</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/sante-hepatique">Comment prendre soin de la santé hépatique</a></li>
        <li><a href="/fr/tips/prevention-cancer-foie">Prévention du cancer du foie</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default LiverCancer;
