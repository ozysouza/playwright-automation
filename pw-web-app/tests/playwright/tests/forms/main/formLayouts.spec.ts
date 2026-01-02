import { mergeTests } from '@playwright/test'
import { menuSideBarPageTest } from '../../../fixtures/menuSideBarPageTest'
import { formLayoutsPageTest } from '../../../fixtures/formLayoutsPageTest'
import { emailAddress, fullName, password } from '../../../utils/fakerUtils'

const test = mergeTests(
    menuSideBarPageTest,
    formLayoutsPageTest
)

test('User can sign in using the Grid form', async ({
    formLayoutsPage,
    menuSideBarPage
}) => {
    const userData = {
        email: emailAddress(),
        password: password(),
        option: 'Option 2'
    }

    await test.step('Given the user navigates to Forms page', async () => {
        await menuSideBarPage.openFormLayoutsPage()
    })

    await test.step('When the user fill up the sign in form', async () => {
        await formLayoutsPage.signInUsingGrid(userData)
    })

    await test.step('Then the grid form should contain the user data', async () => {
        await formLayoutsPage.assertGridForm(userData)
    })
})

test('User can submit using the Inline form', async ({
    formLayoutsPage,
    menuSideBarPage
}) => {
    const userData = {
        email: emailAddress(),
        name: fullName(),
        rememberMe: false
    }

    await test.step('Given the user navigates to Forms page', async () => {
        await menuSideBarPage.openFormLayoutsPage()
    })

    await test.step('When the user fill up the inline form', async () => {
        await formLayoutsPage.submitInlineForm(userData)
    })

    await test.step('Then the inline form should contain the user data', async () => {
        await formLayoutsPage.assertInlineForm(userData)
    })
})