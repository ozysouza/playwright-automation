import { Locator, Page } from '@playwright/test'

export class MenuSideBarPage {
    private readonly page: Page
    readonly datePickerMenuItem: Locator
    readonly formLayoutsMenuItem: Locator
    readonly smartTableMenuItem: Locator
    readonly toastrMenuItem: Locator
    readonly tooltipMenuItem: Locator

    constructor(page: Page) {
        this.page = page
        this.datePickerMenuItem = page.getByText('Datepicker')
        this.formLayoutsMenuItem = page.getByText('Form Layouts')
        this.smartTableMenuItem = page.getByText('Smart Table')
        this.toastrMenuItem = page.getByText('Toastr')
        this.tooltipMenuItem = page.getByText('Tooltip')
    }

    async openDatePage() {
        await this.openSideBarItem('Forms')
        await this.datePickerMenuItem.click()
    }

    async openFormLayoutsPage() {
        await this.openSideBarItem('Forms')
        await this.formLayoutsMenuItem.click()
    }

    async openSmartTablePage() {
        await this.openSideBarItem('Tables & Data')
        await this.smartTableMenuItem.click()
    }

    async openToastrPage() {
        await this.openSideBarItem('Modal & Overlays')
        await this.toastrMenuItem.click()
    }

    async openToolTipPage() {
        await this.openSideBarItem('Modal & Overlays')
        await this.tooltipMenuItem.click()
    }

    private async openSideBarItem(sideBarTitle: string) {
        const menuItem = this.page.getByTitle(sideBarTitle)
        const expandedState = await menuItem.getAttribute('aria-expanded')

        if (expandedState == "false") {
            await menuItem.click()
        }
    }
}