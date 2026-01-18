import { test as base } from "@playwright/test";
import { RequestHandler } from "../helpers/api/requestHandler";
import { config } from "../config/api-test.config";
import { APILogger } from '../utils/logger'
import { setCustomExpectLogger } from '../utils/customExpect'

export type TestFixtures = {
    requestHandler: RequestHandler
}

export const test = base.extend<TestFixtures>({
    requestHandler: async ({ request }, use) => {
        const logger = new APILogger()
        setCustomExpectLogger(logger)
        await use(new RequestHandler(request, config.apiUrl, logger))
    }
})