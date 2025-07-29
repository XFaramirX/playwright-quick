import { test as base, Page } from "@playwright/test";
import { ApiClient, createApiClient } from "../helpers/api/api-client";
import { CHIRPY_LOGIN, CHIRPY_PASSWORD } from "../../playwright.config";

// === Fixture Types ===
interface ApiFixtures {
  api: ApiClient;
}

interface NewUserInfo {
  email: string;
  password: string;
  name: string;
  api: ApiClient;
}

type ErrorRequest = {
  url: string;
  status: number;
  statusText: string;
};

// === Combined Export ===
export const test = base.extend<{
  api: ApiClient;
  newUser: NewUserInfo;
  pageWithMonitoring: Page;
}>({
  // Authenticated API client using CHIRPY credentials
  api: async ({ playwright }, use) => {
    const request = await playwright.request.newContext();
    const api = createApiClient(request);

    await api.authenticate({
      email: CHIRPY_LOGIN,
      password: CHIRPY_PASSWORD,
    });

    await use(api);
  },

  // Random new user with API client
  newUser: async ({ playwright }, use) => {
    const request = await playwright.request.newContext();
    const api = createApiClient(request);

    const randomStr = Math.random().toString(36).substring(2, 8);
    const email = `user_${randomStr}@example.com`;
    const password = Math.random().toString(36).substring(2, 10);
    const name = `name_${randomStr}`;

    await api.createNewUser({ email, password, name });

    const userInfo: NewUserInfo = { email, password, name, api };
    await use(userInfo);

    // Optional cleanup: await api.deleteUser(response.id);
  },

  // Monitor for failed API responses
  pageWithMonitoring: [
    async ({ page }, use, testInfo) => {
      const failedRequests: ErrorRequest[] = [];

      page.on("response", (response) => {
        const url = response.url();
        const status = response.status();
        const statusText = response.statusText();

        if (status >= 400) {
          failedRequests.push({ url, status, statusText });
        }
      });

      await use(page);

      if (failedRequests.length > 0) {
        await testInfo.attach("fail-request.json", {
          body: JSON.stringify(failedRequests, null, 2),
          contentType: "application/json",
        });
        throw new Error("Failing API requests detected.");
      }
    },
    { auto: true },
  ],
});
