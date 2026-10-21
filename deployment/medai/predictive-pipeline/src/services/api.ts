const API_URL = process.env.NEXT_PUBLIC_PREDICTION_API_URL || 'http://localhost:8000';

export async function predictDisease(disease: string, inputData: Record<string, unknown>) {
  try {
    const response = await fetch(`${API_URL}/predict`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ disease, values: inputData }) });
    const data = await response.json();
    return response.ok ? data : { error: data.detail || data.error || 'Prediction failed' };
  } catch { return { error: 'Prediction service unavailable' }; }
}

export async function getAvailableModels() {
  try { const response = await fetch(`${API_URL}/models`); return response.ok ? response.json() : []; } catch { return []; }
}
