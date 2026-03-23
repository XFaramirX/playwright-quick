import { test as base } from './api.fixture';
import { BasePage } from '../pages/base.page';
import { HomePage } from '../pages/home/home.page';
import { ExcalidrawPage } from '../pages/excalidraw/excalidraw.page';

type MyFixtures = {
    basePage: BasePage;
    homePage: HomePage;
    excalidrawPage: ExcalidrawPage;
}
export const test = base.extend<MyFixtures>({
    basePage: async ({ page }, use) => {
        await use(new BasePage(page));
    },

    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    excalidrawPage: async ({ page }, use) => {
        await use(new ExcalidrawPage(page));
    }
})

export { expect } from '@playwright/test'; 