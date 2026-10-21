import { test, expect } from '@playwright/test';

test('flujo médico protegido: ficha oncológica y revisión de completitud', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL(/\/acceso$/);
  await page.screenshot({ path: 'test-results/medai-access.png', fullPage: true });

  await page.getByLabel('Correo profesional').fill('medico@medai.local');
  await page.getByLabel('Contraseña').fill('credencial-invalida');
  await page.getByRole('button', { name: 'Entrar al portal' }).click();
  await expect(page.locator('p.error')).toContainText('No se pudo validar');

  await page.getByLabel('Contraseña').fill('cambiar-esta-clave');
  await page.getByRole('button', { name: 'Entrar al portal' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole('heading', { name: 'Ficha de revisión oncológica' })).toBeVisible();
  await page.getByRole('button', { name: 'Pulmón no microcítico' }).click();
  await expect(page.getByRole('heading', { name: 'Pulmón no microcítico' })).toBeVisible();
  await page.getByRole('button', { name: 'Comprobar ficha' }).click();
  await expect(page.locator('p.error')).toContainText('Faltan');

  await page.getByLabel('Consulta para el asistente').fill('¿Cómo reviso si la ficha está completa?');
  await page.getByRole('button', { name: 'Enviar' }).click();
  await expect(page.locator('.message.bot').last()).toContainText(/incompleto/i);
  await page.screenshot({ path: 'test-results/medai-dashboard.png', fullPage: true });
});

test('cierre de la página: distribución responsive y cambio completo de idioma', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/');
  await page.getByRole('button', { name: 'EN' }).click();
  const closing = page.locator('.closing');
  await closing.scrollIntoViewIfNeeded();
  await expect(closing.getByRole('heading', { name: 'Try the workflow with anonymized cases and tell us what information is missing for better decisions.' })).toBeVisible();
  await expect(closing.getByText('A CLINICAL PILOT IN THREE STEPS')).toBeVisible();
  await expect(closing.getByRole('link', { name: 'Open the review workspace' })).toBeVisible();
  const desktopColumns = await page.locator('.closing-grid').evaluate(element => getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length);
  expect(desktopColumns).toBe(2);
  await page.screenshot({ path: 'test-results/medai-home-closing.png' });

  await page.setViewportSize({ width: 390, height: 844 });
  const mobileColumns = await page.locator('.closing-grid').evaluate(element => getComputedStyle(element).gridTemplateColumns.trim().split(/\s+/).length);
  expect(mobileColumns).toBe(1);
  await page.getByRole('button', { name: 'FR' }).click();
  await expect(closing.getByRole('heading', { name: 'Testez le parcours avec des cas anonymisés et indiquez les informations manquantes pour mieux décider.' })).toBeVisible();
  await expect(closing.getByRole('link', { name: 'Ouvrir l’espace de revue' })).toBeVisible();
});
