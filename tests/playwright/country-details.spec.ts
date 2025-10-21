import { test, expect } from '@playwright/test';

const usaSelector = 'path[data-country-id="840"]';
const englishLanguage = 'english ';

test.describe('Country details modal', () => {
        test('opens and closes when clicking a country', async ({ page }) => {
                await page.goto('/');
                const usa = page.locator(usaSelector);
                await usa.waitFor();

                await usa.click();

                const modal = page.getByRole('dialog', { name: /United States/ });
                await expect(modal).toBeVisible();
                await expect(modal.getByText(/UN status/i)).toContainText('UN member');
                await expect(modal.getByText(/Population/i)).toBeVisible();
                await expect(modal.getByText('English')).toBeVisible();

                await modal.getByRole('button', { name: /close modal/i }).click();
                await expect(modal).toBeHidden();
                await expect(usa).not.toHaveClass(/selected-country/);
        });

        test('maintains language highlight when a country is selected', async ({ page }) => {
                await page.goto('/');

                const input = page.getByPlaceholder('What Languages Do You Speak?');
                await input.fill(englishLanguage);
                await input.press('Tab');
                // allow network update
                await page.waitForTimeout(1000);

                const usa = page.locator(usaSelector);
                await usa.waitFor();

                const fillBeforeSelection = await usa.getAttribute('fill');
                expect(fillBeforeSelection).not.toBe('none');

                await usa.click();
                const modal = page.getByRole('dialog', { name: /United States/ });
                await expect(modal).toBeVisible();

                const fillAfterSelection = await usa.getAttribute('fill');
                expect(fillAfterSelection).toBe(fillBeforeSelection);
                await expect(usa).toHaveClass(/selected-country/);

                await modal.getByRole('button', { name: /close modal/i }).click();
                await expect(modal).toBeHidden();
                expect(await usa.getAttribute('fill')).toBe(fillBeforeSelection);
        });

        test('supports keyboard interaction for accessibility', async ({ page }) => {
                await page.goto('/');

                const usa = page.locator(usaSelector);
                await usa.waitFor();
                await usa.focus();
                await page.keyboard.press('Enter');

                const modal = page.getByRole('dialog', { name: /United States/ });
                await expect(modal).toBeVisible();

                await page.keyboard.press('Escape');
                await expect(modal).toBeHidden();
        });
});

test.describe('Country details modal on mobile', () => {
        test.use({ viewport: { width: 375, height: 812 } });

        test('stacks language details for narrow screens', async ({ page }) => {
                await page.goto('/');

                const usa = page.locator(usaSelector);
                await usa.waitFor();
                await usa.click();

                const modal = page.getByRole('dialog', { name: /United States/ });
                await expect(modal).toBeVisible();

                const firstLanguage = modal.getByRole('listitem').first();
                const flexDirection = await firstLanguage.evaluate((element) =>
                        getComputedStyle(element).flexDirection
                );

                expect(flexDirection).toBe('column');

                const boundingBox = await modal.boundingBox();
                expect(boundingBox?.width ?? 0).toBeLessThanOrEqual(375);
        });
});
