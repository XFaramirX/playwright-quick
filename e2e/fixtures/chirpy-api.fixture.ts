import { ChirpyApiClient, createChirpyApiClient } from "../specs/api/chirpy-client";
import { test as base } from "@playwright/test";
import { CHIRPY_LOGIN, CHIRPY_PASSWORD } from "../../playwright.config"

/**
 * Provides an authenticated chirpyApi client using CHIRPY_LOGIN & CHIRPY_PASSWORD from config.
 */
interface ChirpyApiFixtures {
  chirpyApi: ChirpyApiClient;
}

export const test = base.extend<ChirpyApiFixtures>({
  chirpyApi: async ({ playwright }, use) => {
    const request = await playwright.request.newContext();
    const login = CHIRPY_LOGIN;
    const password = CHIRPY_PASSWORD;

    const chirpyApi = createChirpyApiClient(request);
    await chirpyApi.authenticate({
      email: login,
      password,
    });

    await use(chirpyApi);
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
  chirpyApi: ChirpyApiClient;
}

export const testNewUser = base.extend<{ newUser: NewUserInfo }>({
  newUser: async ({ playwright }, use) => {
    const request = await playwright.request.newContext();
    const chirpyApi = createChirpyApiClient(request);

    // Generate random credentials
    const randomStr = Math.random().toString(36).substring(2, 8);
    const email = `user_${randomStr}@example.com`;
    const password = Math.random().toString(36).substring(2, 10);
    const name = `name_${randomStr}`;

    // Create new user
    const response = await chirpyApi.createNewUser({ email, password, name });
    console.log(response)
    const userInfo: NewUserInfo = {
      email,
      password,
      name,
      chirpyApi,
    };

    await use(userInfo);

    // Optional: delete the user if your API supports cleanup
    // await chirpyApi.deleteUser(response.id);
  },
});
