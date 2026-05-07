import { test, expect } from '../../fixtures/base';
import { pwApi } from 'pw-api-plugin';


test.describe('API Tests for https://jsonplaceholder.typicode.com', { tag: ['@api'] }, () => {

    const baseUrl = 'https://jsonplaceholder.typicode.com';

    test('Testing API Endpoints - Perform Single Call for Each CRUD Operation (GET, HEAD, POST, PUT, PATCH, DELETE)', async ({ request, page }) => {

        // ✔️ Example of pwApi.get
        const responseGet = await pwApi.get({ request, page }, `${baseUrl}/posts/1`);
        expect(responseGet.status()).toBe(200);
        const responseBodyGet = await responseGet.json();
        expect(responseBodyGet).toHaveProperty('id', 1);


        // ✔️ Example of pwApi.head
        const responseHead = await pwApi.head({ request, page }, `${baseUrl}/posts/1`);
        expect(responseHead.status()).toBe(200);


        // ✔️ Example of pwApi.post (with request body and request headers)
        const responsePost = await pwApi.post({ request, page }, `${baseUrl}/posts`, {
            data: {
                title: 'foo',
                body: 'bar',
                userId: 1,
            },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            }
        });
        expect(responsePost.status()).toBe(201);
        const responseBodyPost = await responsePost.json();
        expect(responseBodyPost).toHaveProperty('id', 101);


        // ✔️ Example of pwApi.put (with request body and request headers)
        const responsePut = await pwApi.put({ request, page }, 'https://jsonplaceholder.typicode.com/posts/1', {
            data: {
                id: 1,
                title: 'foo',
                body: 'bar',
                userId: 1,
            },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        expect(responsePut.ok()).toBeTruthy();
        const responseBodyPut = await responsePut.json();
        expect(responseBodyPut).toHaveProperty('id', 1);


        // ✔️ Example of pwApi.patch (with request body and request headers)
        const responsePatch = await pwApi.patch({ request, page }, 'https://jsonplaceholder.typicode.com/posts/1', {
            data: {
                title: 'foo',
            },
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        });
        expect(responsePatch.ok()).toBeTruthy();


        // ✔️ Example for pwApi.delete
        const responseDelete = await pwApi.delete({ request, page }, 'https://jsonplaceholder.typicode.com/posts/1');
        expect(responseDelete.ok()).toBeTruthy();

    })


    test('Verify Single API Call Using pwApi.fetch with Default GET Method', async ({ request, page }) => {

        // ✔️ Example of pwApi.fetch (default GET)
        const responseFetch = await pwApi.fetch({ request, page }, `${baseUrl}/posts`);
        expect(responseFetch.status()).toBe(200);
        const responseBodyFetch = await responseFetch.json();
        expect(responseBodyFetch.length).toBeGreaterThan(4);

    })

})