import { FormEvent, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useLanguage } from '../contexts/LanguageContext';

const copy = {
  es: { title: 'Acceso para médicos', eyebrow: 'Área restringida', intro: 'Ingrese las credenciales proporcionadas por la administración.', email: 'Correo profesional', password: 'Contraseña', submit: 'Entrar al portal', busy: 'Validando…', error: 'No se pudo validar su acceso. Consulte a la administración de MedAI.' },
  en: { title: 'Clinician access', eyebrow: 'Secure workspace', intro: 'Enter the credentials provided by your MedAI administrator.', email: 'Professional email', password: 'Password', submit: 'Enter workspace', busy: 'Signing in…', error: 'We could not verify your access. Contact your MedAI administrator.' },
  fr: { title: 'Accès des médecins', eyebrow: 'Espace sécurisé', intro: 'Saisissez les identifiants fournis par votre administrateur MedAI.', email: 'Courriel professionnel', password: 'Mot de passe', submit: 'Accéder à l’espace', busy: 'Connexion…', error: 'Accès non vérifié. Veuillez contacter l’administrateur MedAI.' },
};

export default function Access() {
  const router = useRouter(); const { language } = useLanguage(); const t = copy[language];
  const [email, setEmail] = useState(''); const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent) { event.preventDefault(); setLoading(true); setError(''); try { const response = await fetch('/api/auth/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ email, password }) }); if (!response.ok) { setError(t.error); return; } router.push('/dashboard'); } catch { setError(t.error); } finally { setLoading(false); } }
  return <div className="page"><Head><title>{`${t.title} | MedAI`}</title></Head><Header/><main className="auth auth-modern"><section className="card auth-card auth-card-modern"><div className="eyebrow">{t.eyebrow}</div><h1>{t.title}</h1><p className="muted">{t.intro}</p><form onSubmit={submit}><div className="field"><label htmlFor="email">{t.email}</label><input id="email" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required/></div><div className="field"><label htmlFor="password">{t.password}</label><input id="password" type="password" autoComplete="current-password" value={password} onChange={event => setPassword(event.target.value)} required/></div>{error && <p className="error" role="alert">{error}</p>}<button className="button" type="submit" disabled={loading}>{loading ? t.busy : t.submit}</button></form></section></main><Footer/></div>;
}
