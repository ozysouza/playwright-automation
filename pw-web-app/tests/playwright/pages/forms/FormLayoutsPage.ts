import { Locator, Page, expect } from "@playwright/test";

export class FormLayoutsPage {
    private readonly page: Page
    readonly usingGridForm: Locator
    readonly inlineForm: Locator

    constructor(page: Page) {
        this.page = page
        this.usingGridForm = page.locator('nb-card', { hasText: "Using the Grid" })
        this.inlineForm = page.locator('nb-card', { hasText: "Inline form" })
    }

    /**
     * Asserts that the "Inline Form" form contains the expected user data.
     * @param userData - Object containing the expected form values
     * @param userData.email - Expected email address
     * @param userData.name - Expected name
     * @param userData.rememberMe - Expected true or false on Remember me checkbox
     */
    async assertInlineForm(userData: {
        email: string,
        name: string,
        rememberMe: boolean
    }) {
        await expect(this.inlineForm.getByRole('textbox', { name: "Email" })).toHaveValue(userData.email)
        await expect(this.inlineForm.getByRole('textbox', { name: "Jane Doe" })).toHaveValue(userData.name)
        if (userData.rememberMe) {
            await expect(this.inlineForm.getByRole('checkbox', { name: "Remember me" })).toBeChecked()
        } else {
            await expect(this.inlineForm.getByRole('checkbox', { name: "Remember me" })).not.toBeChecked()
        }  
    }

    /**
     * Asserts that the "Using the Grid" form contains the expected user data.
     * @param userData - Object containing the expected form values
     * @param userData.email - Expected email address
     * @param userData.password - Expected password
     * @param userData.option - Expected selected radio option label
     */
    async assertGridForm(userData: {
        email: string,
        password: string,
        option: string
    }) {
        await expect(this.usingGridForm.getByRole('textbox', { name: "Email" })).toHaveValue(userData.email)
        await expect(this.usingGridForm.getByRole('textbox', { name: "Password" })).toHaveValue(userData.password)
        await expect(this.usingGridForm.getByRole('radio', { name: userData.option })).toBeChecked()
    }

    /**
     * Fills out and submits the "Using the Grid" sign-in form.
     * @param userData - Object containing the form input values
     * @param userData.email - Email address to be entered
     * @param userData.password - Password to be entered
     * @param userData.option - Radio option label to be selected
     */
    async signInUsingGrid(userData: {
        email: string,
        password: string,
        option: string
    }) {
        await this.usingGridForm.waitFor({ state: 'visible' })
        await this.usingGridForm.getByRole('textbox', { name: "Email" }).fill(userData.email)
        await this.usingGridForm.getByRole('textbox', { name: "Password" }).fill(userData.password)
        await this.usingGridForm.getByRole('radio', { name: userData.option }).check({ force: true })
        await this.usingGridForm.getByRole('button', { name: "Sign in" }).click()
    }

    /**
     * Fills out and submits the "Inline form" submit form.
     * @param userData - Object containing the form input values
     * @param userData.email - Email address to be entered
     * @param userData.name - Name to be entered
     * @param userData.rememberMe - Checkbox to be true or false
     */
    async submitInlineForm(userData: {
        email: string,
        name: string,
        rememberMe: boolean
    }) {
        await this.inlineForm.waitFor({ state: 'visible' })
        await this.inlineForm.getByRole('textbox', { name: "Jane Doe" }).fill(userData.name)
        await this.inlineForm.getByRole('textbox', { name: "Email" }).fill(userData.email)
        if (userData.rememberMe) {
            await this.inlineForm.getByRole('checkbox').check({ force: true })
        }
        await this.inlineForm.getByRole('button', {name: "Submit"}).click()
    }
}