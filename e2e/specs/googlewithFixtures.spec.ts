import { expect } from '@playwright/test';
import { test } from '../fixtures/api.fixture';
import { CHIRPY_LOGIN } from '../../playwright.config';

test('authenticated API works', async ({ api }) => {
  const profile = await api.authenticate({
    email: CHIRPY_LOGIN,
    password: process.env.CHIRPY_PASSWORD || '',
  }); // assuming this method exists
  console.log(profile);

});

test('create and test new user', async ({ newUser }) => {
  console.log('New user:', newUser.email);
  expect(newUser.email).toBeDefined();
});

test('monitoring and new user together', async ({ pageWithMonitoring, newUser }) => {
  await pageWithMonitoring.goto('https://danube-web.shop');
  console.log(`Test ran as user ${newUser.email}`);
});
