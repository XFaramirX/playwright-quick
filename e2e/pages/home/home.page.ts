import { BasePage} from '../base.page';
import step from '../../helpers/steps.helper';
import { Page, expect } from '@playwright/test'; // Use @playwright/test, not playwright/test

export class HomePage extends BasePage {
    protected readonly headingH1;

    constructor(page: Page) {
        super(page);
        this.headingH1 = this.page.locator('h1');
    }

    @step
    async checkH1(): Promise<void> {
        await expect(this.headingH1).toHaveText('');
    }
}
