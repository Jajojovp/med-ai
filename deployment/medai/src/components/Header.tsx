import Link from 'next/link';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';
interface HeaderProps { isLoggedIn?: boolean; onLogout?: () => void; }
export default function Header({ isLoggedIn = false, onLogout }: HeaderProps) {
  const { language } = useLanguage(); const en = language === 'en'; const fr = language === 'fr';
  return <header className="header"><div className="container header"><Link href="/" className="brand">med<b>ai</b></Link><nav className="nav" aria-label={en ? 'Main navigation' : fr ? 'Navigation principale' : 'Navegación principal'}><Link href="/#workflow">{en ? 'Platform' : fr ? 'Plateforme' : 'Plataforma'}</Link><Link href="/#seguridad">{en ? 'Trust' : fr ? 'Confiance' : 'Seguridad'}</Link>{isLoggedIn ? <><Link href="/dashboard">{en ? 'Clinician workspace' : fr ? 'Espace clinique' : 'Portal médico'}</Link><button className="button ghost" onClick={onLogout}>{en ? 'Log out' : fr ? 'Déconnexion' : 'Salir'}</button></> : <Link className="button" href="/acceso">{en ? 'Clinician access' : fr ? 'Accès médecins' : 'Acceso médicos'}</Link>}<LanguageSelector /></nav></div></header>;
}
