import type { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/Header';
import Footer from '../components/Footer';
import DoctorDashboard from '../components/DoctorDashboard';
import { authorized } from '../lib/auth';
import { useLanguage } from '../contexts/LanguageContext';
export const getServerSideProps:GetServerSideProps=async(context)=>{const email=authorized(context.req as any);return email?{props:{}}:{redirect:{destination:'/acceso',permanent:false}}};
export default function Dashboard(){const router=useRouter();const{language}=useLanguage();async function logout(){await fetch('/api/auth/logout',{method:'POST'});router.push('/');}const title=language==='en'?'Clinician workspace':language==='fr'?'Espace clinique':'Portal médico';return <div className="page"><Head><title>{`${title} | MedAI`}</title></Head><Header isLoggedIn onLogout={logout}/><DoctorDashboard/><Footer/></div>}
