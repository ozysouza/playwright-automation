import { expect } from '@playwright/test'

interface Article {
    title: string
    slug: string
    author: object
    body: string
    createdAt: string
    updatedAt: string
}

export function assertArticlesProperties(articles: Article[]) {
    for (const article of articles) {
        expect(article).toHaveProperty('title')
        expect(article).toHaveProperty('slug')
        expect(article).toHaveProperty('author')
        expect(article).toHaveProperty('body')
        expect(article).toHaveProperty('createdAt')
        expect(article).toHaveProperty('updatedAt')
    }
}
