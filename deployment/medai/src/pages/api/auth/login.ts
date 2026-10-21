import type { NextApiRequest, NextApiResponse } from 'next';
import { cookie, createSession, isDoctor } from '../../../lib/auth';
export default function handler(req:NextApiRequest,res:NextApiResponse){if(req.method!=='POST')return res.status(405).end();const{email,password}=req.body||{};if(typeof email!=='string'||typeof password!=='string'||!isDoctor(email,password))return res.status(401).json({error:'Credenciales no autorizadas.'});res.setHeader('Set-Cookie',cookie(createSession(email)));return res.status(200).json({email});}
