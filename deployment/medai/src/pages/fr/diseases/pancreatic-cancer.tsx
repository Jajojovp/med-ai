import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const PancreaticCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cancer du pancréas"
      subtitle="Tumeur maligne pancréatique"
      description="Le cancer du pancréas est une maladie agressive souvent diagnostiquée à un stade avancé. La recherche et le diagnostic précoce sont essentiels."
      imageUrl="/images/pancreatic-cancer.jpg"
    >
      <h3>Qu'est-ce que le cancer du pancréas ?</h3>
      <p>C'est une tumeur maligne qui se développe dans les tissus du pancréas, un organe clé de la digestion et du contrôle de la glycémie.</p>
      <h3>Symptômes fréquents</h3>
      <ul>
        <li>Perte de poids</li>
        <li>Ictère</li>
        <li>Douleur abdominale</li>
        <li>Perte d'appétit</li>
      </ul>
      <h3>Prévention</h3>
      <ul>
        <li>Ne pas fumer</li>
        <li>Alimentation saine</li>
        <li>Contrôle des maladies chroniques</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/sante-pancreatique">Comment prendre soin de la santé pancréatique</a></li>
        <li><a href="/fr/tips/prevention-cancer-pancreas">Prévention du cancer du pancréas</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default PancreaticCancer;
