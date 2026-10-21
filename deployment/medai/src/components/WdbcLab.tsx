import { FormEvent, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const FEATURES = ['radius','texture','perimeter','area','smoothness','compactness','concavity','concave points','symmetry','fractal_dimension'];
const GROUPS = ['mean','se','worst'];
const LABELS: Record<string,string> = { radius:'Radio',texture:'Textura',perimeter:'Perímetro',area:'Área',smoothness:'Suavidad',compactness:'Compacidad',concavity:'Concavidad','concave points':'Puntos cóncavos',symmetry:'Simetría',fractal_dimension:'Dimensión fractal',mean:'Media',se:'Error estándar',worst:'Peor valor' };
const FR_LABELS: Record<string,string> = { radius:'Rayon',texture:'Texture',perimeter:'Périmètre',area:'Aire',smoothness:'Régularité',compactness:'Compacité',concavity:'Concavité','concave points':'Points concaves',symmetry:'Symétrie',fractal_dimension:'Dimension fractale',mean:'Moyenne',se:'Erreur standard',worst:'Valeur maximale' };
const EXAMPLES: Record<'B'|'M',number[]> = {
  B:[13.54,14.36,87.46,566.3,.09779,.08129,.06664,.04781,.1885,.05766,.2699,.7886,2.058,23.56,.008462,.0146,.02387,.01315,.0198,.0023,15.11,19.26,99.7,711.2,.144,.1773,.239,.1288,.2977,.07259],
  M:[17.99,10.38,122.8,1001,.1184,.2776,.3001,.1471,.2419,.07871,1.095,.9053,8.589,153.4,.006399,.04904,.05373,.01587,.03003,.006193,25.38,17.33,184.6,2019,.1622,.6656,.7119,.2654,.4601,.1189],
};
type Result = { scores: { model:string; prediction:'benign'|'malignant'; malignant_probability:number }[] };

export default function WdbcLab() {
  const { language } = useLanguage();
  const [values,setValues] = useState<Record<string,string>>({});
  const [result,setResult] = useState<Result|null>(null);
  const [error,setError] = useState('');
  const [busy,setBusy] = useState(false);
  const en=language==='en', fr=language==='fr';
  const label=(key:string)=>en ? key : fr ? FR_LABELS[key] || key : LABELS[key] || key;
  function loadExample(kind:'B'|'M') { const features=GROUPS.flatMap(group=>FEATURES.map(name=>`${name}_${group}`)); setValues(Object.fromEntries(features.map((key,index)=>[key,String(EXAMPLES[kind][index])]))); setResult(null); setError(''); }
  async function run(event:FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setResult(null);
    try {
      const features=GROUPS.flatMap(group=>FEATURES.map(name=>`${name}_${group}`));
      const numeric=Object.fromEntries(features.map(key=>[key,Number(values[key])]));
      if(features.some(key=>!values[key]||!Number.isFinite(numeric[key]))) throw new Error(en?'Enter all 30 finite numeric measurements.':fr?'Saisissez les 30 mesures numériques finies.':'Introduce las 30 mediciones numéricas finitas.');
      const response=await fetch('/api/wdbc-predict',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({disease:'breast_wdbc',values:numeric})});
      const data=await response.json();
      if(!response.ok) throw new Error(typeof data.detail==='string'?data.detail:data.detail?.error||data.error||'Inference failed');
      setResult(data);
    } catch(e) { setError(e instanceof Error?e.message:'Inference failed'); } finally { setBusy(false); }
  }
  return <article className="card tool wdbc-lab"><div className="eyebrow">{en?'Research demonstration · WDBC':fr?'Démonstration de recherche · WDBC':'Demostración de investigación · WDBC'}</div><h2>{en?'Breast mass classification: benign or malignant':fr?'Classification d’une masse mammaire : bénigne ou maligne':'Clasificación de masa mamaria: benigna o maligna'}</h2><div className="oncology-banner"><strong>{en?'Different task from the clinical form.':fr?'Tâche différente de la fiche clinique.':'Tarea distinta de la ficha clínica.'}</strong> {en?'Enter 30 measurements extracted from a fine needle aspirate (FNA) image. This dataset does not use stage, HER2, ER/PR, or PD-L1. Demo values only; not validated for patient care.':fr?'Saisissez 30 mesures extraites d’une image de ponction à l’aiguille fine (FNA). Ce jeu de données n’utilise ni stade, HER2, ER/PR ou PD-L1. Valeurs de démonstration uniquement ; non validé pour les soins.':'Introduce 30 mediciones extraídas de una imagen de aspirado con aguja fina (FNA). Este conjunto no usa estadio, HER2, ER/PR ni PD-L1. Solo valores de demostración; no está validado para atención clínica.'}</div><p className="muted">{en?'Units follow the source CSV. All 30 numeric values are required.':fr?'Les unités suivent le fichier source. Les 30 valeurs numériques sont requises.':'Las unidades siguen el archivo fuente. Se requieren los 30 valores numéricos.'}</p><div className="example-actions"><button type="button" className="button secondary" onClick={()=>loadExample('B')}>{en?'Load benign example':fr?'Charger un exemple bénin':'Cargar ejemplo benigno'}</button><button type="button" className="button secondary" onClick={()=>loadExample('M')}>{en?'Load malignant example':fr?'Charger un exemple malin':'Cargar ejemplo maligno'}</button></div><form onSubmit={run}><div className="wdbc-grid">{GROUPS.map(group=><fieldset key={group}><legend>{label(group)}</legend><div className="wdbc-fields">{FEATURES.map(name=>{const key=`${name}_${group}`;return <label key={key}>{label(name)}<input type="number" step="any" required value={values[key]||''} onChange={e=>{setValues(old=>({...old,[key]:e.target.value}));setResult(null);}}/></label>})}</div></fieldset>)}</div>{error&&<p role="alert" className="error">{error}</p>}<button className="button" disabled={busy}>{busy?(en?'Evaluating…':fr?'Évaluation…':'Evaluando…'):(en?'Run five models':fr?'Exécuter les cinq modèles':'Ejecutar cinco modelos')}</button></form>{result&&<div className="wdbc-results" aria-live="polite"><h3>{en?'Model outputs':fr?'Sorties des modèles':'Resultados de los modelos'}</h3><div className="wdbc-outcomes">{result.scores.map(item=><div key={item.model}><b>{item.model.replaceAll('_',' ')}</b><strong>{item.prediction==='malignant'?(en?'Malignant':fr?'Maligne':'Maligno'):(en?'Benign':fr?'Bénigne':'Benigno')}</strong><span>{en?'Malignant-class score':fr?'Score de classe maligne':'Puntuación clase maligna'}: {(item.malignant_probability*100).toFixed(1)}%</span></div>)}</div><p className="muted">{en?'Retrospective public-dataset demonstration only. Not an individual clinical estimate, diagnosis, prognosis or treatment recommendation.':fr?'Démonstration rétrospective sur données publiques uniquement. Ni estimation clinique individuelle, ni diagnostic, pronostic ou recommandation de traitement.':'Demostración retrospectiva con datos públicos. No es estimación clínica individual, diagnóstico, pronóstico ni recomendación de tratamiento.'}</p></div>}</article>;
}
