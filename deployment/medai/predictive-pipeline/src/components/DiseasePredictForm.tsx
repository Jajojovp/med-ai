import React, { useState } from 'react';
import { predictDisease } from '../services/api';

interface Props {
  disease: string;
  inputFields: string[];
}

const DiseasePredictForm: React.FC<Props> = ({ disease, inputFields }) => {
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    const prediction = await predictDisease(disease, inputs);
    if (prediction.error) setError(prediction.error);
    else setResult(JSON.stringify(prediction));
  };

  return (
    <form onSubmit={handleSubmit}>
      {inputFields.map((field) => (
        <div key={field}>
          <label>{field}: </label>
          <input name={field} type="number" step="any" onChange={handleChange} required />
        </div>
      ))}
      <button type="submit">Predecir</button>
      {result && <div>Resultado: {result}</div>}
      {error && <div style={{color:'red'}}>Error: {error}</div>}
    </form>
  );
};

export default DiseasePredictForm;
