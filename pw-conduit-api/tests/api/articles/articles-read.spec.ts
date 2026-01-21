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

test('Get global articles list', async ({ requestHandler, assertApi }) => {
    let response: any

    await test.step('Given the global articles API endpoint', async () => {
    })

    await test.step('When the user with no authorization requests the first 10 articles', async () => {
        response = await requestHandler
            .path('/articles')
            .clearAuth()
            .getRequest(200)
    })

    await test.step('Then the response should match the articles schema', async () => {
        await apiExpect(response).toMatchSchema('articles', 'GET_articles')
    })

    await test.step('And the response should contain exactly 10 articles', async () => {
        expect(response.articles.length).toBe(10)
        expect(response.articlesCount).toBe(10)
    })

    await test.step('And each article should have required fields', async () => {
        assertApi.articlesProperties(response.articles)
    })

    await test.step('And the response should match the expected global payload', async () => {
        for (let index = 0; index < response.length; index++) {
            expect(response.articles[index]).toMatchObject({
                slug: globalPayload.articles[index].slug,
                title: globalPayload.articles[index].title,
                description: globalPayload.articles[index].description,
            })
        }
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
