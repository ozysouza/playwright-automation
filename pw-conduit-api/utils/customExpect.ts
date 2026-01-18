import { APILogger } from "./logger";
import { expect as baseExpect } from '@playwright/test'
import { validateSchema } from "./schemaValidator";

/**
 * Shared API logger instance used by the custom matcher
 */
let apiLogger: APILogger | undefined

/**
 * Registers the APILogger instance to be used by custom API expectations.
 * This should be called during fixture initialization so that
 * schema validation errors can include recent request/response logs.
 *
 * @param logger - Initialized APILogger instance
 */
export const setCustomExpectLogger = (logger: APILogger): void => {
    apiLogger = logger
}

declare global {
    namespace PlaywrightTest {
        interface Matchers<R, T> {
            /**
             * Validates the response body against a JSON schema.
             *
             * @param dirName - Directory name under `response-schemas`
             * @param fileName - Schema file base name (without `_schema.json`)
             * @param createSchemaFlag - When true, generates a new schema from the response
             */
            toMatchSchema(
                dirName: string,
                fileName: string,
                createSchemaFlag?: boolean
            ): Promise<R>
        }
    }
}

export const apiExpect = baseExpect.extend({
    /**
     * Asserts that the received API response matches the expected JSON schema.
     *
     * When validation fails, the error message includes:
     * - Schema validation errors
     * - Recent API request/response logs (if logger is configured)
     *
     * @param received - Actual API response body
     * @param dirName - Schema directory name
     * @param fileName - Schema file base name (without `_schema.json`)
     * @param createSchemaFlag - Generates a schema if one does not exist
     *
     * @returns Playwright matcher result object
     */
    async toMatchSchema(
        received: unknown,
        dirName: string,
        fileName: string,
        createSchemaFlag: boolean = false
    ) {
        let pass: boolean
        let message = ''

        try {
            await validateSchema(dirName, fileName, received as object, createSchemaFlag)
            pass = true
            message = 'Schema validation passed'
        } catch (error: any) {
            if (!apiLogger) {
                throw new Error('APILogger is not set. Call setCustomExpectLogger() before using toMatchSchema.')
            }

            pass = false
            const logs = apiLogger.getRecentLogs()

            message =
                `${error.message}\n\n` +
                `Recent API Activity:\n${logs}`
        }

        return {
            pass,
            message: () => message
        }
    }
})
