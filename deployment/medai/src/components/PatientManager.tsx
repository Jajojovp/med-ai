import React, { useState } from 'react';

interface Patient {
  id: number;
  name: string;
  age: number;
  diagnosis: string;
  lastVisit: string;
}

const initialPatients: Patient[] = [
  { id: 1, name: 'Juan Pérez', age: 54, diagnosis: 'Diabetes', lastVisit: '2025-06-20' },
  { id: 2, name: 'Ana Gómez', age: 62, diagnosis: 'Cardiopatía', lastVisit: '2025-06-15' }
];

const PatientManager: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [name, setName] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [diagnosis, setDiagnosis] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !age || !diagnosis) return;
    setPatients([
      ...patients,
      { id: Date.now(), name, age: Number(age), diagnosis, lastVisit: new Date().toISOString().slice(0, 10) }
    ]);
    setName('');
    setAge('');
    setDiagnosis('');
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Gestión de Pacientes</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-6 flex-wrap">
        <input type="text" placeholder="Nombre" value={name} onChange={e => setName(e.target.value)} className="border rounded px-3 py-2" required />
        <input type="number" placeholder="Edad" value={age} onChange={e => setAge(Number(e.target.value))} className="border rounded px-3 py-2" required />
        <input type="text" placeholder="Diagnóstico" value={diagnosis} onChange={e => setDiagnosis(e.target.value)} className="border rounded px-3 py-2" required />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-full">Agregar</button>
      </form>
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 text-left">Nombre</th>
            <th className="py-2 px-4 text-left">Edad</th>
            <th className="py-2 px-4 text-left">Diagnóstico</th>
            <th className="py-2 px-4 text-left">Última visita</th>
          </tr>
        </thead>
        <tbody>
          {patients.map(p => (
            <tr key={p.id} className="border-t">
              <td className="py-2 px-4">{p.name}</td>
              <td className="py-2 px-4">{p.age}</td>
              <td className="py-2 px-4">{p.diagnosis}</td>
              <td className="py-2 px-4">{p.lastVisit}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PatientManager;
