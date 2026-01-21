import { test as base } from '@playwright/test'
import { AssertApi } from '../helpers/api/AssertApi'

export const assertApiTest = base.extend<{
    assertApi: AssertApi
}>({
    assertApi: async ({ }, use) => {
        await use(new AssertApi())
    }
})
