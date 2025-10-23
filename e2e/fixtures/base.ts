import { test as base } from './api.fixture';
import { BasePage } from '../pages/base.page';
import { HomePage } from '../pages/home/home.page';

type MyFixtures = {
    basePage: BasePage;
    homePage: HomePage;
}
export const test = base.extend<MyFixtures>({
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    }
})

export { expect } from '@playwright/test'; 