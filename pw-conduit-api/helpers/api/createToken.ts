import { RequestHandler } from "./requestHandler";
import { APILogger } from '../../utils/logger'
import { config } from "../../config/api-test.config";
import { request } from "@playwright/test";

/**
 * Creates and returns an authentication token for the Conduit API.
 *
 * The returned token is formatted and ready to be used as an
 * Authorization header value.
 *
 * @param email - User email used for authentication
 * @param password - User password used for authentication
 * @returns A formatted authorization token string (e.g. "Token <jwt>")
 *
 * @throws Error if the login request fails or returns an unexpected status code
 */
export async function createToken(email: string, password: string) {
    const context = await request.newContext()
    const logger = new APILogger()
    const requestHandler = new RequestHandler(context, config.apiUrl, logger)

    try {
        const tokenResp = await requestHandler
            .path("/users/login")
            .body({ "user": { "email": email, "password": password } })
            .postRequest(200)
        return `Token ${tokenResp.user.token}`
    } catch (error) {
        Error.captureStackTrace(createToken)
        throw error
    } finally {
        await context.dispose()
    }    
}