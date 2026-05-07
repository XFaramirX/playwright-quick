import { test as base, expect } from '@playwright/test';
import type { APIResponse } from '@playwright/test';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export type Article = {
    id: number;
    title: string;
    body: string;
    userId: number;
};

export type ArticlePayload = {
    title: string;
    body: string;
    userId: number;
};

type PublishArticleResult = {
    response: APIResponse;
    articleId: number;
    responseBody: Record<string, unknown>;
};

type ArticleFixtures = {
    articleApiBaseUrl: string;
    publishArticle: (payload: ArticlePayload) => Promise<PublishArticleResult>;
    queueArticleForTeardownCleanup: (articleId: number) => void;
    publishedArticle: Article;
};

export const test = base.extend<ArticleFixtures>({
    articleApiBaseUrl: async ({}, use) => {
        await use(BASE_URL);
    },

    queueArticleForTeardownCleanup: async ({ request, articleApiBaseUrl }, use) => {
        const createdArticleIds: number[] = [];

        await use((articleId: number) => {
            createdArticleIds.push(articleId);
        });

        for (const articleId of createdArticleIds) {
            const deleteResponse = await request.delete(`${articleApiBaseUrl}/posts/${articleId}`);
            expect(deleteResponse.status()).toBe(200);
        }
    },

    publishArticle: async ({ request, articleApiBaseUrl }, use) => {
        await use(async (payload: ArticlePayload) => {
            const response = await request.post(`${articleApiBaseUrl}/posts`, {
                data: payload,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8',
                },
            });

            expect(response.status()).toBe(201);
            const responseBody = (await response.json()) as Record<string, unknown>;
            const articleId = Number(responseBody.id);
            expect(articleId).toBeGreaterThan(0);

            return {
                response,
                articleId,
                responseBody,
            };
        });
    },

    publishedArticle: async ({ publishArticle, queueArticleForTeardownCleanup }, use) => {
        const randomSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const payload: ArticlePayload = {
            title: `article-title-${randomSuffix}`,
            body: `article-body-${randomSuffix}`,
            userId: 1,
        };
        const { articleId, responseBody } = await publishArticle(payload);
        queueArticleForTeardownCleanup(articleId);

        const article: Article = {
            id: articleId,
            title: String(responseBody.title ?? ''),
            body: String(responseBody.body ?? ''),
            userId: Number(responseBody.userId ?? payload.userId),
        };

        await use(article);
    },
});

export { expect } from '@playwright/test';
