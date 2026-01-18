import { test as base } from "@playwright/test";
import { RequestHandler } from "../helpers/api/requestHandler";
import { config } from "../config/api-test.config";
import { APILogger } from '../utils/logger'
import { setCustomExpectLogger } from '../utils/customExpect'
import { createToken } from '../helpers/api/createToken'

export type TestFixtures = {
    requestHandler: RequestHandler
}

export type WorkerFixture = {
    authToken: string
}

export const test = base.extend<TestFixtures, WorkerFixture>({
    /**
     * Worker-scoped authentication token fixture.
     *
     * This fixture runs once per worker and generates an authorization token
     * using valid user credentials. The token is then reused across all tests
     * executed by the same worker, improving performance and consistency.
     *
     * Scope: worker
     */
    authToken: [async ({ }, use) => {
        const authToken = await createToken(config.userEmail, config.userPassword)
        await use(authToken)
    }, { scope: 'worker' }],

    requestHandler: async ({ request, authToken }, use) => {
        const logger = new APILogger()
        setCustomExpectLogger(logger)
        await use(new RequestHandler(request, config.apiUrl, logger, authToken))
    }
})