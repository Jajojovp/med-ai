import type { NextApiRequest, NextApiResponse } from 'next';
import { authorized } from '../../lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed.' });
  if (!authorized(req)) return res.status(401).json({ error: 'Acceso médico requerido.' });
  if (req.headers['content-type']?.split(';')[0] !== 'application/json') return res.status(415).json({ error: 'Content-Type debe ser application/json.' });
  try {
    const response = await fetch(`${process.env.PREDICTION_API_URL || 'http://127.0.0.1:8000'}/wdbc/predict`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(process.env.PREDICTION_API_KEY ? { 'x-api-key': process.env.PREDICTION_API_KEY } : {}) },
      body: JSON.stringify(req.body),
    });
    return res.status(response.status).json(await response.json());
  } catch {
    return res.status(503).json({ error: 'Servicio WDBC no disponible. Inicie la API Python en el puerto 8000.' });
  }
}
