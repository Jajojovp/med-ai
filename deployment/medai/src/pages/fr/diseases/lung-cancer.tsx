import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const LungCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cancer du poumon"
      subtitle="Tumeur maligne du tissu pulmonaire"
      description="Le cancer du poumon est l'une des principales causes de mortalité par cancer dans le monde. Un dépistage précoce est essentiel pour améliorer le pronostic."
      imageUrl="/images/lung-cancer.jpg"
    >
      <h3>Qu'est-ce que le cancer du poumon ?</h3>
      <p>C'est une tumeur maligne qui se développe dans les poumons, généralement associée au tabagisme, mais pouvant aussi toucher les non-fumeurs.</p>
      <h3>Symptômes fréquents</h3>
      <ul>
        <li>Toux persistante</li>
        <li>Douleur thoracique</li>
        <li>Perte de poids</li>
        <li>Essoufflement</li>
      </ul>
      <h3>Prévention</h3>
      <ul>
        <li>Ne pas fumer</li>
        <li>Éviter l'exposition aux polluants</li>
        <li>Contrôles médicaux réguliers</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/sante-pulmonaire">Comment améliorer la santé pulmonaire</a></li>
        <li><a href="/fr/tips/prevention-cancer-poumon">Prévention du cancer du poumon</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default LungCancer;
