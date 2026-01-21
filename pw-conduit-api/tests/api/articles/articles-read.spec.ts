import { expect, mergeTests } from '@playwright/test';
import { requestHandlerTest } from '../../../fixtures/requestHandlerTest'
import { assertApiTest } from '../../../fixtures/assertApiTest';
import { apiExpect } from '../../../utils/customExpect';
import globalPayload from '../../../request-objects/articles/GLOBAL_GET_articles.json'
import pagGlobalPayload from '../../../request-objects/articles/PAG_GLOBAL_GET_articles.json'

export const test = mergeTests(
    requestHandlerTest,
    assertApiTest,
);

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
        assertApi.articlesMatch(response.articles, globalPayload.articles)
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
        assertApi.articlesMatch(response.articles, pagGlobalPayload.articles)
    })
})
