import { ApiClient, createApiClient } from "../helpers/api/api-client";
import { test as base } from "@playwright/test";
import { CHIRPY_LOGIN, CHIRPY_PASSWORD } from "../../playwright.config"

/**
 * Provides an authenticated api client using CHIRPY_LOGIN & CHIRPY_PASSWORD from config.
 */
interface ApiFixtures {
  api: ApiClient;
}

export const test = base.extend<ApiFixtures>({
  api: async ({ playwright }, use) => {
    const request = await playwright.request.newContext();
    const login = CHIRPY_LOGIN;
    const password = CHIRPY_PASSWORD;

    const api = createApiClient(request);
    await api.authenticate({
      email: login,
      password,
    });

    await use(api);
  },
});

/**
 * Provides a fixture that creates a new random user,
 * returning its credentials and an API client to interact as that user.
 */
interface NewUserInfo {
  email: string;
  password: string;
  name: string;
  api: ApiClient;
}

export const testNewUser = base.extend<{ newUser: NewUserInfo }>({
  newUser: async ({ playwright }, use) => {
    const request = await playwright.request.newContext();
    const api = createApiClient(request);

    // Generate random credentials
    const randomStr = Math.random().toString(36).substring(2, 8);
    const email = `user_${randomStr}@example.com`;
    const password = Math.random().toString(36).substring(2, 10);
    const name = `name_${randomStr}`;

    // Create new user
    const response = await api.createNewUser({ email, password, name });
    console.log(response)
    const userInfo: NewUserInfo = {
      email,
      password,
      name,
      api,
    };

    await use(userInfo);

    // Optional: delete the user if your API supports cleanup
    // await api.deleteUser(response.id);
  },
});
