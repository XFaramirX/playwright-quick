import { Page, expect, Locator } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import step from "../helpers/steps.helper";
import { lightHouseThresholds, screenshotOptions } from '../fixtures/constants';

export class BasePage {
    readonly page: Page;
    constructor(page: Page) {
        this.page = page;
    }

    @step
    async hoverAndClick(locator: Locator): Promise<void> {
        await locator.hover();
        await locator.click();
    }

    @step
    async getTrimmedText(locator: Locator): Promise<string> {
        return (await locator.textContent())!.trim();
    }

    @step
    async waitForText(locator: Locator, text: string, timeout = 5000): Promise<void> {
        await expect(locator).toHaveText(text, { timeout: timeout });
    }

    @step
    async goto(url: string): Promise<void> {
        await this.page.goto(url);
    }

    @step
    async checkA11y(): Promise<any> {
        const accessibilityScanResults = await new AxeBuilder({ page: this.page })
            .include("body")
            .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
            .analyze();
        return accessibilityScanResults.violations;
    }

    @step
    async checkLighthouse(): Promise<any> {
        const { playAudit } = await import('playwright-lighthouse');
        const lighthouseAudit = await playAudit({
            page: this.page,
            port: 9222,
            thresholds: lightHouseThresholds,
            reports: {
                formats: {
                    html: true,
                },
                directory: `${process.cwd()}/e2e/reports/lighthouse`,
            },
        });

        return lighthouseAudit;
    }

    @step
    async takeQuerySnapshot(
        locator: string,
        record: { componentId: string },
    ) {
        await expect(
            this.page.locator(locator)
        ).toHaveScreenshot(
            `${record.componentId}.png`,
            {
                maxDiffPixelRatio: screenshotOptions.maxDiffPixelRatio,
            }
        );
    }

    @step
    async takeFullPageScreenshot(): Promise<void> {
        await this.page.screenshot({ path: `${process.cwd()}/e2e/reports/screenshots`, fullPage: true });
    }

    @step
    closeBrowser(): Promise<void> { return this.page.close(); }

}


