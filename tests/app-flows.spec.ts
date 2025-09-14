import { test, expect } from '@playwright/test';

test.describe('Critical user flows', () => {
  test('chord selection page shows practice controls', async ({ page }) => {
    await page.goto('/choose-chords');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Choose Your Chords')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Practice' })).toBeDisabled();
  });

  test('progression builder shows key selector', async ({ page }) => {
    await page.goto('/create');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText('Chord Progression Builder')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Clear All' })).toBeVisible();
  });

  test('practice mode loads with metronome controls', async ({ page }) => {
    await page.goto('/practice?chords=C,G');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/Practice Mode/)).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Metronome/i })).toBeVisible();
  });
});
