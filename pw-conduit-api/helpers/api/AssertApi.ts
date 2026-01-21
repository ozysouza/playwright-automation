import { expect } from '@playwright/test'

interface Article {
    slug: string
    title: string
    description: string
    body: string
    createdAt: string
    updatedAt: string
    author: object
}

export class AssertApi {

    /**
     * Asserts that a list of articles matches expected article metadata.
     *
     * Compares each article against the corresponding expected article
     * using a partial match (`toMatchObject`) to validate only stable fields:
     * - slug, title, description and body
     * @param articles - Articles returned by the API response
     * @param expectedArticles - Expected articles payload used for comparison
     */
    articlesMatch(articles: Article[], expectedArticles: any[]) {
        articles.forEach((article, index) => {
            expect(article).toMatchObject({
                slug: expectedArticles[index].slug,
                title: expectedArticles[index].title,
                description: expectedArticles[index].description,
                body: expectedArticles[index].body
            })
        })
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


