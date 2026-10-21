import React from 'react';

const ReportViewer: React.FC = () => {
  // Aquí se integrará la lógica para obtener y mostrar reportes predictivos del backend
  const reports = [
    {
      id: 1,
      title: 'Predicción de Diabetes',
      date: '2025-06-29',
      result: 'Alto riesgo',
      recommendations: 'Realizar controles periódicos, mantener dieta saludable y actividad física.'
    },
    {
      id: 2,
      title: 'Predicción de Cardiopatía',
      date: '2025-06-28',
      result: 'Riesgo moderado',
      recommendations: 'Reducir consumo de sal, controlar presión arterial y realizar ejercicio.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold mb-6">Reportes y Análisis Predictivos</h1>
      <div className="space-y-6">
        {reports.map(report => (
          <div key={report.id} className="bg-white rounded shadow p-6">
            <h2 className="font-semibold text-lg mb-1">{report.title}</h2>
            <div className="text-gray-500 text-sm mb-2">{report.date}</div>
            <div className="mb-2"><b>Resultado:</b> {report.result}</div>
            <div><b>Recomendaciones:</b> {report.recommendations}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportViewer;
