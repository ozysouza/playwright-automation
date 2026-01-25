import { expect, mergeTests } from '@playwright/test';
import { requestHandlerTest } from '../../../fixtures/requestHandlerTest'
import { assertApiTest } from '../../../fixtures/assertApiTest';
import { apiExpect } from '../../../utils/customExpect';
import { buildArticlePayload } from './factory/articleFactory'
import globalPayload from '../../../request-objects/articles/GLOBAL_GET_articles.json'
import pagGlobalPayload from '../../../request-objects/articles/PAG_GLOBAL_GET_articles.json'

export const test = mergeTests(
    requestHandlerTest,
    assertApiTest,
);

test.describe('Articles - Read (GET) Operations', {
    tag: '@articles @get',
}, () => {
    test('Get article by slug', async ({ requestHandler, assertApi }) => {
        let articlesResponse: any
        let articleBySlugResponse: any

        await test.step('Given an unauthenticated user retrieves the global articles list', async () => {
            articlesResponse = await requestHandler
                .path('/articles')
                .clearAuth()
                .getRequest(200)
        })

        await test.step('When the user requests an article by its slug', async () => {
            articleBySlugResponse = await requestHandler
                .path(`/articles/${articlesResponse.articles[0].slug}`)
                .clearAuth()
                .getRequest(200)
        })

        await test.step('Then the response should match the article-by-slug schema', async () => {
            await apiExpect(articleBySlugResponse).toMatchSchema('articles', 'GET_articles_slug')
        })

        await test.step('And the returned article should match the selected global article', async () => {
            const expectedArticle = articlesResponse.articles[0]
            const actualArticle = articleBySlugResponse.article

            expect(actualArticle).toMatchObject({
                slug: expectedArticle.slug,
                title: expectedArticle.title,
                description: expectedArticle.description,
                body: expectedArticle.body,
                tagList: expectedArticle.tagList,
            })
        })
    })

    test('Get global articles list', async ({ requestHandler, assertApi }) => {
        let response: any

        await test.step('Given the user is unauthenticated', async () => {
            requestHandler.clearAuth()
        })

        await test.step('When the user requests global articles', async () => {
            response = await requestHandler
                .path('/articles')
                .getRequest(200)
        })

        await test.step('Then the response should match the articles schema', async () => {
            await apiExpect(response).toMatchSchema('articles', 'GET_articles')
        })

        await test.step('And the response should return 10 articles', async () => {
            assertApi.articlesPagination(response.articles, 10)
            expect(response.articlesCount).toBe(10)
        })

        await test.step('And each article should have required fields', async () => {
            assertApi.articlesProperties(response.articles)
        })

        await test.step('And the response should match the expected global payload', async () => {
            assertApi.articlesMatches(response.articles, globalPayload.articles)
        })
    })

    test('Get global articles list with pagination', async ({ requestHandler, assertApi }) => {
        let response: any

        await test.step('Given the user is unauthenticated', async () => {
            requestHandler.clearAuth()
        })

        await test.step('When the user requests paginated global articles', async () => {
            response = await requestHandler
                .path('/articles')
                .params({ limit: 3, offset: 5 })
                .getRequest(200)
        })

        await test.step('Then the response should match the articles schema', async () => {
            await apiExpect(response).toMatchSchema('articles', 'GET_articles')
        })

        await test.step('And pagination should return three articles', async () => {
            assertApi.articlesPagination(response.articles, 3)
        })

        await test.step('And each article should have the required fields', async () => {
            assertApi.articlesProperties(response.articles)
        })

        await test.step('And the response should match the expected paginated payload', async () => {
            assertApi.articlesMatches(response.articles, pagGlobalPayload.articles)
        })
    })

    test('Should return 404 when requesting an article with an invalid slug', async ({ requestHandler, assertApi }) => {
        let response: any
        const invalidSlug = 'this-is-invalid-123'

        await test.step('When the user requests an article with a non-existing slug', async () => {
            response = await requestHandler
                .path(`/articles/${invalidSlug}`)
                .clearAuth()
                .getRequest(404)
        })

        await test.step('Then the API should return a not found error message', async () => {
            expect(response.errors.article[0]).toMatch("not found")
        })
    })
})

test.describe('Articles - Create (POST) Operations', {
    tag: '@articles @post',
}, () => {

    test('Authenticated user can create an article', async ({ requestHandler, assertApi }) => {
        let payload: any
        let articleResponse: any

        await test.step('Given an authenticated user', async () => {
            // Authentication is handled by the worker fixture (authToken)
        })

        await test.step('When the user creates a new article', async () => {
            payload = buildArticlePayload()

            articleResponse = await requestHandler
                .path('/articles')
                .body(payload)
                .postRequest(201)
        })

        await test.step('Then the response should match the articles schema', async () => {
            await apiExpect(articleResponse).toMatchSchema('articles', 'POST_articles')
        })

        await test.step('And the created article should appear in the global feed', async () => {
            const globalArticlesRequest = await requestHandler
                .path('/articles')
                .getRequest(200)
                
            const createdArticle = globalArticlesRequest.articles.find(
                (a: any) => a.slug === articleResponse.article.slug
            )

            expect(createdArticle).toBeTruthy()
            assertApi.articlesMatches(createdArticle, articleResponse.article)
        })

        await test.step('And the article should be deleted to keep the environment clean', async () => {
            await requestHandler
                .path(`/articles/${articleResponse.article.slug}`)
                .deleteRequest(204)
        })
    })
})