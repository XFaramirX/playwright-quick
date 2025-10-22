import { test, expect } from '@playwright/test';

test.describe('Codemify Homepage', () => {

    test('Verify Navigation Links', async ({ page }) => {
        await page.goto('https://codemify.com');

        const navigationLinks = [
            { name: 'About us', url: '/about-us' },
            { name: 'Courses', url: '#submenu:courses' },
            { name: 'Call Experts', url: '/meeting_expert' },
            { name: 'Offers', url: '#submenu:offers' },
            { name: 'Reviews', url: '/testimonials' },
            { name: 'Prices', url: '/experts' },
        ];

        for (const link of navigationLinks) {
            await test.step(`Verify navigation to ${link.name}`, async () => {
                await page.click(`a:has-text("${link.name}")`);
                await expect(page).toHaveURL(new RegExp(link.url));
            });
        }
    });

    test('Verify Submenu Functionality', async ({ page }) => {
        await page.goto('https://codemify.com');

        const submenuLinks = [
            { name: 'Courses', submenu: '#submenu:courses' },
            { name: 'Offers', submenu: '#submenu:offers' },
        ];

        for (const link of submenuLinks) {
            await test.step(`Verify submenu for ${link.name}`, async () => {
                await page.hover(`a:has-text("${link.name}")`);
                const submenu = page.locator(`a[href="${link.submenu}"]`);
                await expect(submenu).toBeVisible();
            });
        }
    });

    test('Verify "Start Here" Button', async ({ page }) => {
        await page.goto('https://codemify.com');

        const startHereButton = page.locator('text=Start Here');
        await startHereButton.click();
        await expect(page).toHaveURL(/#start/);
    });

    test('Verify Hero Text Content', async ({ page }) => {
        await page.goto('https://codemify.com');

        const heroText = page.locator('text=START A NEW CAREER IN TECH');
        await expect(heroText).toBeVisible();
    });

    test('Verify "Try Free Lesson" Button', async ({ page }) => {
        await page.goto('https://codemify.com');

        const tryFreeLessonButton = page.locator('#rec1034888381').getByRole('button', { name: 'Try Free Lesson' });
        await tryFreeLessonButton.click();
        await expect(page).toHaveURL("https://codemify.com/");
    });

    test('Verify "Learn More" Buttons for Courses', async ({ page }) => {
        await page.goto('https://codemify.com');

        // Click the "Learn More" button for Manual QA course
        const manualLearnMore = page.getByRole('button', { name: 'Learn more' }).first();
        await manualLearnMore.click();
        await expect(page.getByRole('dialog', { name: 'Manual QA Engineer' })).toBeVisible();
        await expect(page.getByText('This course requires no prior experience or technical background.')).toBeVisible();
        await expect(page.getByText('Duration: 2 months')).toBeVisible();
        await page.getByRole('button', { name: 'Close dialog window' }).click();

        // Click the "Learn More" button for Automation QA course
        const automationLearnMore = page.getByRole('button', { name: 'Learn more' }).nth(1);
        await automationLearnMore.click();
        await expect(page.getByRole('dialog', { name: 'QA Automation Engineer' })).toBeVisible();
        await expect(page.getByText('Prerequisite: Manual QA knowledge is needed.')).toBeVisible();
        await expect(page.getByText(/Duration: 3\.5 months/)).toBeVisible();
        await page.getByRole('button', { name: 'Close dialog window' }).click();
    });

});