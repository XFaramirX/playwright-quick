import { test, expect } from '../../fixtures/article.fixture';

test.describe('Article Creation', { tag: ['@smoke'] }, () => {
    test('Publish article and validate response payload', async ({
        publishArticle,
        articleApiBaseUrl,
        queueArticleForTeardownCleanup,
    }) => {

        //Article payload with random suffix to ensure uniqueness across test runs and avoid conflicts with existing data
        const randomSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const articlePayload = {
            title: `article-title-${randomSuffix}`,
            body: `article-body-${randomSuffix}`,
            userId: 1,
        };

        const { articleId, responseBody } = await test.step('Publish article via POST /posts', () =>
            publishArticle(articlePayload),
        );

        await test.step('Validate article creation response and payload mapping', async () => {
            expect(responseBody.id).toBe(articleId);
            expect(responseBody.title).toBe(articlePayload.title);
            expect(responseBody.body).toBe(articlePayload.body);
            expect(responseBody.userId).toBe(articlePayload.userId);
        });

        await test.step('Validate base API URL is configured correctly', () => {
            expect(articleApiBaseUrl).toBe('https://jsonplaceholder.typicode.com');
        });

        await test.step('Queue article for cleanup — fixture teardown deletes after test body', () => {
            queueArticleForTeardownCleanup(articleId);
        });
    });


    test('POST /posts creates article and response matches sent payload', async ({ publishedArticle }) => {
        expect(publishedArticle.id).toBeGreaterThan(0);
        expect(typeof publishedArticle.title).toBe('string');
        expect(typeof publishedArticle.body).toBe('string');
        expect(publishedArticle.userId).toBe(1);
    });
});
