import { test as base } from "@playwright/test";
import { RequestHandler } from "../helpers/api/requestHandler";
import { config } from "../config/api-test.config";
import { APILogger } from '../utils/logger'

export type TestFixtures = {
    requestHandler: RequestHandler
}

export const test = base.extend<TestFixtures>({
    requestHandler: async ({ request }, use) => {
        const logger = new APILogger()
        await use(new RequestHandler(request, config.apiUrl, logger))
    }
})