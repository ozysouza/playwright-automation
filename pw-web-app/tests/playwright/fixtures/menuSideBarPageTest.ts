import { test } from '@playwright/test'
import { MenuSideBarPage } from '../pages/navigation-menu/MenuSideBarPage'

const menuSideBarPageTest = test.extend<{
    menuSideBarPage: MenuSideBarPage
}>({
    menuSideBarPage: async ({ page }, use) => {
        await page.goto('/')
        await use(new MenuSideBarPage(page))
    }
})

export { menuSideBarPageTest }