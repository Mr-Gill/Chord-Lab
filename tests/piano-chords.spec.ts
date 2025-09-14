import { test, expect } from '@playwright/test';

test.describe('Chord wheel page', () => {
  test('displays chord wheel with default chords', async ({ page }) => {
    await page.goto('/wheel');
    await expect(page.locator('.chord-wheel')).toBeVisible();
    const chords = page.locator('.chord-item');
    await expect(chords).toHaveCount(4);
    await expect(chords.first()).toHaveText('C');
  });

  test('allows selecting a chord', async ({ page }) => {
    await page.goto('/wheel');
    const gChord = page.locator('.chord-item', { hasText: 'G' }).first();
    await expect(gChord).toBeVisible();
    await gChord.click();
  });
});
