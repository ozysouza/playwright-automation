import { test } from '@playwright/test'
import { FormLayoutsPage } from '../pages/forms/FormLayoutsPage'

const formLayoutsPageTest = test.extend<{
    formLayoutsPage: FormLayoutsPage
}>({
    formLayoutsPage: async ({ page }, use) => {
        await use(new FormLayoutsPage(page))
    }
})

export { formLayoutsPageTest }