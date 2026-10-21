import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const BreastCancer: React.FC = () => {
  return (
    <DiseaseArticle
      title="Cancer du sein"
      subtitle="Tumeur maligne de la glande mammaire"
      description="Le cancer du sein est le type de cancer le plus fréquent chez la femme. Un dépistage précoce et un traitement opportun améliorent significativement le pronostic."
      imageUrl="/images/breast-cancer.jpg"
    >
      <h3>Qu'est-ce que le cancer du sein ?</h3>
      <p>C'est une tumeur maligne qui se développe dans les cellules de la glande mammaire. Elle peut se propager à d'autres organes si elle n'est pas traitée à temps.</p>
      <h3>Signes d'alerte</h3>
      <ul>
        <li>Masse ou nodule dans le sein</li>
        <li>Changements de la peau ou du mamelon</li>
        <li>Écoulement anormal</li>
      </ul>
      <h3>Prévention et dépistage</h3>
      <ul>
        <li>Auto-examen mammaire mensuel</li>
        <li>Mammographie annuelle à partir de 40 ans</li>
        <li>Mode de vie sain</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/sante-preventive-cancer-sein">Santé préventive dans le cancer du sein</a></li>
        <li><a href="/fr/tips/activite-physique-cancer-sein">Activité physique recommandée</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default BreastCancer;
