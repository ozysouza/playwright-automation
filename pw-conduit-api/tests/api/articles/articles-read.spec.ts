import { test } from '../../../fixtures/requestHandlerTest'
import { expect } from '@playwright/test';
import { apiExpect } from '../../../utils/customExpect';
import globalPayload from '../../../request-objects/articles/GLOBAL_GET_articles.json'

test('Get global articles list', async ({ requestHandler, validate }) => {
    let response: any

    await test.step('Given the global articles API endpoint', async () => {
    })

    await test.step('When the user with no authorization requests the first 10 articles', async () => {
        response = await requestHandler
            .path('/articles')
            .params({ limit: 10, offset: 0 })
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
        validate.articlesProperties(response.articles)
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

