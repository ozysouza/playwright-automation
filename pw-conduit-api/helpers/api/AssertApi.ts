import { expect } from '@playwright/test'
export class AssertApi {

    /**
     * Asserts one or multiple articles against expected article data.
     *
     * This helper supports both:
     * - A single Article object (e.g., POST /articles response)
     * - An array of Articles (e.g., GET /articles list)
     *
     * Internally, it normalizes inputs to arrays to keep the assertion logic DRY.
     *
     * @param articles - The actual article or list of articles returned by the API.
     * @param expectedArticles - The expected article or list of articles to match against.
     */
    articlesMatches(
        articles: Article | Article[],
        expectedArticles: Article | Article[] | any[]): void {

        const actualArray = Array.isArray(articles) ? articles : [articles]
        const expectedArray = Array.isArray(expectedArticles) ? expectedArticles : [expectedArticles]

        actualArray.forEach((article, index) => {
            expect(article).toMatchObject({
                slug: expectedArray[index].slug,
                title: expectedArray[index].title,
                description: expectedArray[index].description,
                body: expectedArray[index].body,
                tagList: expectedArray[index].tagList,
            })
        })
    }

    /**
     * Asserts that the updated article differs from the base article
     * in core user-controlled fields.
     * @param {Article} updatedArticle - The article returned after the PUT update.
     * @param {Article} baseArticle - The original article before the update.
     *
     * @throws Will fail the test if any core field did not change.
     */
    articleNotMatch(updatedArticle: Article, baseArticle: Article): void {
        expect(updatedArticle.title).not.toEqual(baseArticle.title)
        expect(updatedArticle.description).not.toEqual(baseArticle.description)
        expect(updatedArticle.body).not.toEqual(baseArticle.body)
        expect(updatedArticle.tagList).not.toEqual(baseArticle.tagList)
    }

    /**
     * Asserts that an articles response follows pagination constraints.
     * @param articles - Array of articles returned by the API
     * @param expectedLimit - The requested pagination limit
     */
    articlesPagination(articles: Article[], expectedLimit: number) {
        expect(articles).toHaveLength(expectedLimit)
    }

    /**
     * Asserts that a list of articles contain the required properties:
     *  title, slug, author, body, createdAt, updatedAt
     * @param articles - Array of articles returned by the API
     */
    articlesProperties(articles: Article[]) {
        for (const article of articles) {
            expect(article).toHaveProperty('title')
            expect(article).toHaveProperty('slug')
            expect(article).toHaveProperty('author')
            expect(article).toHaveProperty('body')
            expect(article).toHaveProperty('createdAt')
            expect(article).toHaveProperty('updatedAt')
        }
    }

}


