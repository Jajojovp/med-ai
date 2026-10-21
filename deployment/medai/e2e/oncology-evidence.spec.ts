import { expect, test } from '@playwright/test';

test('oncology review explains that form completeness does not run a validated prediction', async ({ page }) => {
  await signIn(page);
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: /ficha de revisión oncológica|oncology review form/i })).toBeVisible();
  await page.locator('#stage').selectOption('I');
  await page.locator('#histology').fill('Carcinoma ductal');
  await page.locator('#er').selectOption('Positivo');
  await page.locator('#pr').selectOption('Positivo');
  await page.locator('#her2').selectOption('Negativo');
  await page.locator('#ki67').fill('12');
  await page.locator('#nodes').fill('0');
  await page.locator('#prior_treatment').fill('Ninguno');
  await page.locator('#case_source').fill('Caso docente anonimizado');
  await page.locator('#updated_at').fill('2026-10-21');
  await page.getByRole('button', { name: /comprobar ficha|check form/i }).click();
  await expect(page.getByText(/No se ejecutó ninguna predicción|No prediction was run/i)).toBeVisible();
});

test('assistant returns selected disease evidence links without sending the query to Gemini', async ({ page }) => {
  await signIn(page);
  await page.goto('/dashboard');
  await page.getByRole('button', { name: /Pulmón no microcítico|Non-small cell lung cancer/i }).click();
  const request = page.waitForRequest(req => req.url().endsWith('/api/assistant'));
  await page.getByRole('textbox', { name: /consulta para el asistente|assistant question/i }).fill('Ensayos clínicos, estudios, nutrición y cuidados paliativos');
  await page.getByRole('button', { name: /enviar|send/i }).click();
  const apiRequest = await request;
  expect(apiRequest.postDataJSON()).toMatchObject({ disease: 'lung', language: 'es' });
  await expect(page.getByText(/Recursos generales seleccionados/i)).toBeVisible();
  await expect(page.getByRole('link', { name: /treatment trial search/i })).toHaveAttribute('href', /cancer\.gov\/research\/participate\/clinical-trials/);
});

test('WDBC lab changes all five model outputs between public benign and malignant examples', async ({ page }) => {
  await signIn(page);
  await page.goto('/dashboard');
  await page.getByRole('button', { name: 'Cargar ejemplo benigno' }).click();
  await page.getByRole('button', { name: 'Ejecutar cinco modelos' }).click();
  const results = page.locator('.wdbc-outcomes strong');
  await expect(results).toHaveCount(5);
  await expect(results).toHaveText(Array(5).fill('Benigno'));

  await page.getByRole('button', { name: 'Cargar ejemplo maligno' }).click();
  await page.getByRole('button', { name: 'Ejecutar cinco modelos' }).click();
  await expect(results).toHaveText(Array(5).fill('Maligno'));
});

test('WDBC heading hydrates without stale Kaggle text', async ({ page }) => {
  const hydrationErrors: string[] = [];
  page.on('console', message => {
    if (message.type() === 'error' && /hydration|text content does not match/i.test(message.text())) hydrationErrors.push(message.text());
  });
  await signIn(page);
  await page.goto('/dashboard');
  await expect(page.getByRole('heading', { name: /Clasificación de masa mamaria|Breast mass classification|Classification d’une masse mammaire/i })).toBeVisible();
  await expect(page.getByText(/Demostración de investigación · WDBC|Research demonstration · WDBC|Démonstration de recherche · WDBC/i)).toBeVisible();
  expect(hydrationErrors).toEqual([]);
});

async function signIn(page: import('@playwright/test').Page) {
  await page.goto('/acceso');
  await page.getByLabel('Correo profesional').fill('medico@medai.local');
  await page.getByLabel('Contraseña').fill('cambiar-esta-clave');
  await page.getByRole('button', { name: 'Entrar al portal' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}
