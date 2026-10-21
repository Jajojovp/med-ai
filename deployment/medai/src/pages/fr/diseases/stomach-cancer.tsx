import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const StomachCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cancer de l'estomac"
      subtitle="Tumeur maligne gastrique"
      description="Le cancer de l'estomac est une maladie dans laquelle des cellules malignes se forment dans les tissus de l'estomac. Un dépistage précoce est essentiel pour le traitement."
      imageUrl="/images/stomach-cancer.jpg"
    >
      <h3>Qu'est-ce que le cancer de l'estomac ?</h3>
      <p>C'est une tumeur qui se développe dans la muqueuse interne de l'estomac et peut se propager à d'autres organes.</p>
      <h3>Symptômes fréquents</h3>
      <ul>
        <li>Indigestion persistante</li>
        <li>Perte d'appétit</li>
        <li>Perte de poids</li>
        <li>Saignement digestif</li>
      </ul>
      <h3>Prévention</h3>
      <ul>
        <li>Régime riche en fruits et légumes</li>
        <li>Éviter le tabac et l'alcool</li>
        <li>Contrôle des infections gastriques</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/sante-gastrique">Comment prendre soin de la santé gastrique</a></li>
        <li><a href="/fr/tips/prevention-cancer-estomac">Prévention du cancer de l'estomac</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default StomachCancer;
