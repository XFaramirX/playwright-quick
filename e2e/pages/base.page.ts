import { Page, expect, Locator, request } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import step from "../helpers/steps.helper";
import { screenshotOptions } from '../fixtures/constants';
import { CsvFormatterStream, FormatterRow } from "fast-csv";

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
        await this.page.goto(url, { waitUntil: "load" });
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
    async takeQuerySnapshot(
        locator: string,
        name: string,
    ) {
        await expect(
            this.page.locator(locator)
        ).toHaveScreenshot(
            `${name}.png`,
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


    @step
    async getAllLinksFromPage(page: Page) {
        // getByRole('link') only matches visible links
        // if you want to check all links, you can use a CSS selector
        // like 'locator("a")'
        const links = page.getByRole("link");

        const allLinks = await links.all();
        const allLinkHrefs = await Promise.all(
            allLinks.map((link) => link.getAttribute("href"))
        );
        const validHrefs = allLinkHrefs.reduce((links, link) => {
            expect.soft(link, "link has no a proper href").not.toBeFalsy();
            if (link && !link?.startsWith("mailto:") && !link?.startsWith("#")) { links.add(new URL(link, page.url()).href); }
            return links;
        }, new Set<string>());

        return validHrefs;
    }

    @step
    async loadingTimeWidget(locator: Locator) {
        const startTime = Date.now()
        let endTime

        if (expect(locator.isVisible())) {
            endTime = Date.now()
            const responseTime = endTime - startTime
            console.log(`Oly widget loaded and visible in ${responseTime} ms`)
        }
    }

    @step
    async getApiResponse() {
        const responsePromise = this.page.waitForResponse(
            "https://proxy-dot-nbcu-growth-1342710.uc.r.appspot.com/"
        )
        const response = await responsePromise
        const responseBody = await response.json()
        return responseBody
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async waitForOlyApiResponseFE(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        query: { [x: string]: any; Query: any },
        csvStream: CsvFormatterStream<FormatterRow, FormatterRow>,
        timezone: string,
        randomEventDate: string
    ) {
        const responsePromise = this.page.waitForResponse(
            "https://proxy-dot-nbcu-growth-1342710.uc.r.appspot.com/"
        )
        const response = await responsePromise
        const responseBody = await response.json()
        csvStream.write({
            id: query.Id,
            query: query.Query,
            expectedAnswer: query["Expected Answers"],
            LLMResponse: responseBody.response_text,
            schedule_cards:
                responseBody.schedule_cards && responseBody.schedule_cards.length
                    ? responseBody.schedule_cards.length
                    : 0,
            ApiStatus: responseBody.status ? responseBody.status : "No response",
            timeZone: timezone,
            eventDate: randomEventDate,
        })
        csvStream.end()
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async goldenQueryAPI(query: any, csvStream: any) {
        console.log(query.Query)
        const apiContext = await request.newContext({
            baseURL: "https://proxy-dot-nbcu-growth-1342710.uc.r.appspot.com/",
            extraHTTPHeaders: {
                accept: "*/*",
                "accept-language": "en-US,en;q=0.9,es;q=0.8",
                "cache-control": "no-cache",
                "content-type": "application/json",
                origin: "https://storage.googleapis.com",
                pragma: "no-cache",
                priority: "u=1, i",
                referer: "https://storage.googleapis.com/",
                "sec-ch-ua":
                    '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": '"Android"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "user-agent":
                    "Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Mobile Safari/537.36",
            },
        })
        const response = await apiContext.post("/", {
            data: {
                history: [],
                query: query.Query,
                turn_id: 1,
                session_id: "b34d5553-050d-4678-a580-e5d7e7ae8f6e",
                timezone: "America/New_York",
            },
        })

        const responseBody = await response.json()
        csvStream.write({
            query: query.Query,
            primaryTopic: query["Primary Query Topic"],
            queryType: query["Query Type"],
            sensitive: query["Sensitive"],
            adaptive: query["Adaptive"],
            goldenAnswer: query["Golden Answers"],
            LLMResponse: responseBody.response_text,
            schedule_cards: responseBody.schedule_cards.length,
            ApiStatus: responseBody.status,
        })
        csvStream.end()
        await apiContext.dispose()
    }
}


