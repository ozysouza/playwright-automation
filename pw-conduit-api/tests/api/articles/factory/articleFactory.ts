import { faker } from '@faker-js/faker'
import articlePostPayload from '../../../../request-objects/articles/POST_article.json'

/**
 * Builds a new article request payload with randomized test data.
 *
 * This helper clones the base JSON template and injects dynamic values
 * to avoid collisions (e.g., unique titles and slugs).
 *
 * @param overrides - Optional fields to override generated article values.
 * @returns A fully populated article request payload ready for API submission.
 */
export function buildArticlePayload(
  overrides: Partial<typeof articlePostPayload.article> = {}
) {
  const articleRequest = structuredClone(articlePostPayload)

  articleRequest.article = {
    ...articleRequest.article,
    title: `${faker.lorem.sentence(5)}-${faker.string.uuid()}`,
    description: faker.lorem.sentence(3),
    body: faker.lorem.paragraphs(2),
    tagList: [faker.lorem.word(), faker.lorem.word()],
    ...overrides,
  }

  return articleRequest
}
