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
        let requestResponse: any
        const invalidSlug = 'this-is-invalid-123'

        await test.step('Given the user is unauthenticated', async () => {
            requestResponse = await requestHandler
                .clearAuth()
        })

        await test.step('When the user requests an article with a non-existing slug', async () => {
            requestResponse = await requestHandler
                .path(`/articles/${invalidSlug}`)
                .getRequest(404)
        })

        await test.step('Then the API should return a not found error message', async () => {
            expect(requestResponse.errors.article[0]).toMatch("not found")
        })

        await test.step('And the response should match the GET 404 error schema', async () => {
            await apiExpect(requestResponse).toMatchSchema('errors', 'GET_404_not_found')
        })
    })
})

test.describe('Articles - Update (PUT) Operations', {
    tag: '@articles @put',
}, () => {

    test('Authenticated user can update an existing article', async ({ requestHandler, assertApi }) => {
        let baseArticleResponse: any
        let updatedArticleResponse: any

        await test.step('Given an authenticated user has an existing article', async () => {
            const basePayload = buildArticlePayload()

            baseArticleResponse = await requestHandler
                .path('/articles')
                .body(basePayload)
                .postRequest(201)

            const globalArticlesResponse = await requestHandler
                .path('/articles')
                .getRequest(200)

            const createdArticle = globalArticlesResponse.articles.find(
                (a: Article) => a.slug === baseArticleResponse.article.slug
            )

            expect(createdArticle).toBeTruthy()
            assertApi.articlesMatches(createdArticle, baseArticleResponse.article)
        })

        await test.step('When the user updates the article', async () => {
            const updatePayload = buildArticlePayload()

            updatedArticleResponse = await requestHandler
                .path(`/articles/${baseArticleResponse.article.slug}`)
                .body(updatePayload)
                .putRequest(200)
        })

        await test.step('Then the response should match the PUT articles schema', async () => {
            await apiExpect(updatedArticleResponse).toMatchSchema('articles', 'PUT_articles')
        })

        await test.step('And the updated article should appear in the global feed', async () => {
            const globalArticlesRequest = await requestHandler
                .path('/articles')
                .getRequest(200)

            const updatedArticle = globalArticlesRequest.articles.find(
                (a: Article) => a.slug === updatedArticleResponse.article.slug
            )

            expect(updatedArticleResponse).toBeTruthy()
            assertApi.articlesMatches(updatedArticle, updatedArticleResponse.article)
        })

        await test.step('And the updated fields should differ from the original article', async () => {
            assertApi.articleNotMatch(updatedArticleResponse.article, baseArticleResponse.article)
        })

        await test.step('And the article should be deleted to keep the environment clean', async () => {
            await requestHandler
                .path(`/articles/${updatedArticleResponse.article.slug}`)
                .deleteRequest(204)
        })
    })

    test('Should return 401 when updating an article without authentication', async ({ requestHandler, assertApi }) => {
        let requestResponse: any

        await test.step('Given the user is not authenticated', async () => {
            requestResponse = await requestHandler
                .clearAuth()
        })

        await test.step('When the user attempts to update a new article', async () => {
            const payload = buildArticlePayload()

            requestResponse = await requestHandler
                .path('/articles/invalid-slug')
                .body(payload)
                .putRequest(401)
        })

        await test.step('Then the API should respond with 401 and an authorization error message', async () => {
            expect(requestResponse).toMatchObject({
                status: 'error',
                message: 'missing authorization credentials'
            })
        })

        await test.step('And the response should match the 401 error schema', async () => {
            await apiExpect(requestResponse).toMatchSchema('errors', '401_auth_article')
        })
    })

    test('Should return 404 when updating an article with an invalid slug', async ({ requestHandler, assertApi }) => {
        let requestResponse: any
        const invalidSlug = 'this-is-invalid-123'

        await test.step('Given an authenticated user', async () => {
            // Authentication is handled by the worker fixture (authToken)
        })

        await test.step('When the user attempts to update an article with a non-existing slug', async () => {
            const payload = buildArticlePayload()

            requestResponse = await requestHandler
                .path(`/articles/${invalidSlug}`)
                .body(payload)
                .putRequest(404)
        })

        await test.step('Then the API should return a 404 with an empty body', async () => {
            expect(requestResponse).toEqual({})
        })

        await test.step('And the response should match the 404 error schema', async () => {
            await apiExpect(requestResponse).toMatchSchema('errors', 'PUT_404_not_found')
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
                (a: Article) => a.slug === articleResponse.article.slug
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

    test('Should return 401 when requesting an article without authentication', async ({ requestHandler, assertApi }) => {
        let requestResponse: any

        await test.step('Given the user is not authenticated', async () => {
            requestResponse = await requestHandler
                .clearAuth()
        })

        await test.step('When the user attempts to create a new article', async () => {
            const payload = buildArticlePayload()

            requestResponse = await requestHandler
                .path('/articles')
                .body(payload)
                .postRequest(401)
        })

        await test.step('Then the API should respond with 401 and an authorization error message', async () => {
            expect(requestResponse).toMatchObject({
                status: 'error',
                message: 'missing authorization credentials'
            })
        })

        await test.step('And the response should match the 401 error schema', async () => {
            await apiExpect(requestResponse).toMatchSchema('errors', '401_auth_article')
        })
    })

    /**
     * Validates that the API returns a 422 error when required fields are empty.
     * Dynamically tests title, description, and body fields using parameterized loop.
     */
    const invalidCases = [
        { field: 'body', errorMessage: "can't be blank" },
        { field: 'description', errorMessage: "can't be blank" },
        { field: 'title', errorMessage: "can't be blank" },
    ]
    for (const { field, errorMessage } of invalidCases) {
        test(`Should return 422 when requesting an article with empty ${field} field`, async ({ requestHandler }) => {
            let articleResponse: any

            await test.step('Given an authenticated user', async () => {
                // Authentication is handled by the worker fixture (authToken)
            })

            await test.step(`When the user creates an article with empty ${field} field`, async () => {
                const payload = buildArticlePayload({ [field]: '' })

                articleResponse = await requestHandler
                    .path('/articles')
                    .body(payload)
                    .postRequest(422)
            })

            await test.step(`Then the API should return validation error for ${field}`, async () => {
                expect(articleResponse.errors[field]).toContain(errorMessage)
            })

            await test.step('And the response should match the 422 error schema', async () => {
                await apiExpect(articleResponse).toMatchSchema('errors', `POST_422_unprocessable_${field}_article`)
            })
        })
    }
})

test.describe('Articles - Delete (DEL) Operations', {
    tag: '@articles @del',
}, () => {

    test('Should delete an article and return 204 No Content', async ({ requestHandler, userName }) => {
        let articleResponse: any

        await test.step('Given the authenticated user has an existing article', async () => {
            const articlePayload = buildArticlePayload()

            articleResponse = await requestHandler
                .path('/articles')
                .body(articlePayload)
                .postRequest(201)

            const userArticlesResponse = await requestHandler
                .path('/articles')
                .params({ author: userName })
                .getRequest(200)

            expect(userArticlesResponse.articlesCount).toBe(1)
        })

        await test.step('When the user deletes their article', async () => {
            await requestHandler
                .path(`/articles/${articleResponse.article.slug}`)
                .deleteRequest(204)
        })

        await test.step('Then the API should return 204 No Content', async () => {
            // 204 responses have no body by design
            // Status code assertion is already handled by deleteRequest
        })

        await test.step('And the article should no longer exist for the user', async () => {
            const userArticlesResponse = await requestHandler
                .path('/articles')
                .params({ author: userName })
                .getRequest(200)

            expect(userArticlesResponse.articlesCount).toBe(0)
        })
    })

    test('Should return 401 when deleting an article without authentication', async ({ requestHandler, assertApi }) => {
        let requestResponse: any

        await test.step('Given the user is not authenticated', async () => {
            requestResponse = await requestHandler
                .clearAuth()
        })

        await test.step('When the user attempts to delete an article', async () => {
            const articlesResponse = await requestHandler
                .path('/articles')
                .getRequest(200)

            requestResponse = await requestHandler
                .path(`/articles/${articlesResponse.articles[0].slug}`)
                .deleteRequest(401)
        })

        await test.step('Then the API should respond with 401 and an authorization error message', async () => {
            expect(requestResponse).toMatchObject({
                status: 'error',
                message: 'missing authorization credentials'
            })
        })

        await test.step('And the response should match the 401 error schema', async () => {
            await apiExpect(requestResponse).toMatchSchema('errors', '401_auth_article')
        })
    })

    test('Should return 404 Not Found when deleting an article with an invalid slug', async ({ requestHandler }) => {
        await test.step('Given the user is authenticated', async () => {
            // Authentication is handled by the worker fixture (authToken)
        })

        await test.step('When the user attempts to delete an article using a non-existent slug', async () => {
            await requestHandler
                .path('/articles/invalid-slug')
                .deleteRequest(404)
        })

        await test.step('Then the API should respond with 404 Not Found', async () => {
            // Status code validation is handled by deleteRequest
        })
    })

    test('Should return 403 when attemps to delete an article from another user', async ({ requestHandler, userName }) => {
        let requestResponse: any

        await test.step('Given an authenticated user', async () => {
            // Authentication is handled by the worker fixture (authToken)
        })

        await test.step('When the user attempts to delete an article from another user', async () => {
            const articlesResponse = await requestHandler
                .path('/articles')
                .getRequest(200)

            const foreignArticle = articlesResponse.articles.find(
                (a: any) => a.author.username != userName
            )

            requestResponse = await requestHandler
                .path(`/articles/${foreignArticle.slug}`)
                .deleteRequest(403)
        })

        await test.step('Then the API should respond with 403 and an Forbidden error message', async () => {
            expect(requestResponse).toMatchObject({
                message: 'You are not authorized to delete this article'
            })
        })

        await test.step('And the response should match the 401 error schema', async () => {
            await apiExpect(requestResponse).toMatchSchema('errors', '403_forbidden_article')
        })
    })
})