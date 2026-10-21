import crypto from 'crypto';
import type { NextApiRequest } from 'next';

const NAME = 'medai_doctor_session';
const secret = () => process.env.MEDAI_SESSION_SECRET || 'cambiar-esta-clave-en-produccion';
const sign = (value: string) => crypto.createHmac('sha256', secret()).update(value).digest('base64url');

export function createSession(email: string) {
  const payload = Buffer.from(JSON.stringify({ email, exp: Date.now() + 28800000 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function authorized(req: NextApiRequest) {
  const token = req.cookies[NAME];
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature || signature !== sign(payload)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now() ? data.email as string : null;
  } catch {
    return null;
  }
}

export function isDoctor(email: string, password: string) {
  const accounts = process.env.MEDAI_DOCTOR_ACCOUNTS || 'medico@medai.local:cambiar-esta-clave';
  return accounts.split(',').some(account => {
    const [candidateEmail, candidatePassword] = account.trim().split(':');
    return candidateEmail?.toLowerCase() === email.toLowerCase() && candidatePassword === password;
  });
}

export const cookie = (token: string) =>
  `${NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;
