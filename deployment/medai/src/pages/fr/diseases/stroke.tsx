import React from 'react';
import DiseaseArticle from '../../es/diseases/DiseaseArticle';

const Stroke: React.FC = () => {
  return (
    <DiseaseArticle
      title="Accident vasculaire cérébral (AVC)"
      subtitle="Interruption du flux sanguin cérébral"
      description="L'accident vasculaire cérébral est une urgence médicale qui nécessite une prise en charge immédiate. La prévention et le traitement rapide sauvent des vies et réduisent les séquelles."
      imageUrl="/images/stroke.jpg"
    >
      <h3>Qu'est-ce qu'un accident vasculaire cérébral ?</h3>
      <p>C'est l'interruption soudaine du flux sanguin vers le cerveau, ce qui peut entraîner des lésions cérébrales permanentes.</p>
      <h3>Signes d'alerte</h3>
      <ul>
        <li>Faiblesse ou paralysie d'un côté du corps</li>
        <li>Difficulté à parler ou à comprendre</li>
        <li>Perte de vision</li>
        <li>Forte céphalée</li>
      </ul>
      <h3>Prévention</h3>
      <ul>
        <li>Contrôle de la pression artérielle</li>
        <li>Alimentation saine</li>
        <li>Activité physique régulière</li>
        <li>Ne pas fumer</li>
      </ul>
      <h3>Articles connexes</h3>
      <ul>
        <li><a href="/fr/tips/sante-cerebrovasculaire">Comment prévenir un accident vasculaire cérébral</a></li>
        <li><a href="/fr/tips/recuperation-avc">Récupération après un AVC</a></li>
      </ul>
    </DiseaseArticle>
  );
};

export default Stroke;
