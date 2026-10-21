import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const Diabetes: React.FC = () => {
  return (
    <DiseaseArticle
      title="Diabète sucré"
      subtitle="Maladie métabolique chronique"
      description="Le diabète est une maladie chronique qui affecte la façon dont le corps transforme les aliments en énergie. Elle peut entraîner de graves complications si elle n'est pas correctement contrôlée."
      imageUrl="/images/diabetes.jpg"
    >
      <h3>Qu'est-ce que le diabète ?</h3>
      <p>Le diabète sucré est un groupe de maladies métaboliques caractérisées par une hyperglycémie chronique, résultant de défauts de sécrétion ou d'action de l'insuline.</p>
      <h3>Principaux types</h3>
      <ul>
        <li><b>Type 1 :</b> Le corps ne produit pas d'insuline.</li>
        <li><b>Type 2 :</b> Le corps n'utilise pas correctement l'insuline.</li>
        <li>Gestationnel : Apparaît pendant la grossesse.</li>
      </ul>
      <h3>Symptômes courants</h3>
      <ul>
        <li>Soif excessive</li>
        <li>Mictions fréquentes</li>
        <li>Perte de poids inexpliquée</li>
        <li>Fatigue</li>
      </ul>
      <h3>Prévention et conseils</h3>
      <ul>
        <li>Maintenir une alimentation équilibrée</li>
        <li>Pratiquer une activité physique régulière</li>
        <li>Contrôler le poids corporel</li>
        <li>Éviter la consommation excessive de sucres</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/erreurs-regime-diabetiques">Erreurs courantes dans le régime des diabétiques</a></li>
        <li><a href="/fr/tips/activite-physique-diabete">Activité physique recommandée pour le diabète</a></li>
        <li><a href="/fr/tips/sante-preventive-diabete">Santé préventive dans le diabète</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Diabetes;
