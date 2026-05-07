import { test, expect } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

test.describe('Articles API', { tag: ['@smoke'] }, () => {
    test('GET /posts returns a list of articles', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/posts`);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.length).toBeGreaterThan(0);
    });

    test('GET /posts/:id returns a single article', async ({ request }) => {
        const response = await request.get(`${BASE_URL}/posts/1`);

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.id).toBe(1);
        expect(typeof body.title).toBe('string');
    });

    test('POST /posts creates a new article', async ({ request }) => {
        const payload = { title: 'my title', body: 'my body', userId: 1 };

        const response = await request.post(`${BASE_URL}/posts`, { data: payload });

        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.title).toBe(payload.title);
        expect(body.body).toBe(payload.body);
        expect(body.userId).toBe(payload.userId);
        expect(typeof body.id).toBe('number');
    });

    test('PUT /posts/:id replaces an article', async ({ request }) => {
        const payload = { id: 1, title: 'updated title', body: 'updated body', userId: 1 };

        const response = await request.put(`${BASE_URL}/posts/1`, { data: payload });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.title).toBe(payload.title);
        expect(body.body).toBe(payload.body);
    });

    test('PATCH /posts/:id partially updates an article', async ({ request }) => {
        const response = await request.patch(`${BASE_URL}/posts/1`, {
            data: { title: 'patched title' },
        });

        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.title).toBe('patched title');
    });

    test('DELETE /posts/:id removes an article', async ({ request }) => {
        const response = await request.delete(`${BASE_URL}/posts/1`);

        expect(response.status()).toBe(200);
    });
});
