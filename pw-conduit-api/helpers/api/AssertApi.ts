import { expect } from '@playwright/test'

interface Article {
    title: string
    slug: string
    author: object
    body: string
    createdAt: string
    updatedAt: string
}

export class AssertApi {

    /**
     * Asserts that an articles response follows pagination constraints.
     * @param articles - Array of articles returned by the API
     * @param expectedLimit - The requested pagination limit
     */
    articlesPagination(articles: Article[], expectedLimit: number) {
        expect(articles).toHaveLength(expectedLimit)
    }

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


