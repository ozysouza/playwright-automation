import { test as base } from "@playwright/test";
import { RequestHandler } from "../helpers/api/requestHandler";
import { config } from "../config/api-test.config";

export type TestFixtures = {
    requestHandler: RequestHandler
}

export const test = base.extend<TestFixtures>({
    requestHandler: async ({ request }, use) => {
        await use(new RequestHandler(request, config.apiUrl))
    }
})