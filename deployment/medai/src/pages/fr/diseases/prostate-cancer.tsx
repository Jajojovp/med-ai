import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const ProstateCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cancer de la prostate"
      subtitle="Tumeur maligne de la glande prostatique"
      description="Le cancer de la prostate est l'un des plus fréquents chez l'homme adulte. Un dépistage précoce et un suivi médical sont essentiels pour un bon pronostic."
      imageUrl="/images/prostate-cancer.jpg"
    >
      <h3>Qu'est-ce que le cancer de la prostate ?</h3>
      <p>C'est une tumeur maligne qui se développe dans la glande prostatique. Elle peut évoluer lentement et, dans certains cas, ne pas provoquer de symptômes aux premiers stades.</p>
      <h3>Symptômes et facteurs de risque</h3>
      <ul>
        <li>Difficulté à uriner</li>
        <li>Jet d'urine faible</li>
        <li>Antécédents familiaux</li>
        <li>Âge avancé</li>
      </ul>
      <h3>Prévention et diagnostic</h3>
      <ul>
        <li>Examens médicaux réguliers (PSA, toucher rectal)</li>
        <li>Mode de vie sain</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/sante-prostatique">Comment prendre soin de la santé prostatique</a></li>
        <li><a href="/fr/tips/prevention-cancer-prostate">Prévention du cancer de la prostate</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default ProstateCancer;
