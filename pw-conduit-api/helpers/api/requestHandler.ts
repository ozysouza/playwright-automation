import { APIRequestContext, expect } from "@playwright/test"
import { APILogger } from "../../utils/logger"

export class RequestHandler {

    private apiBody: object = {}
    private apiHeaders: Record<string, string> = {}
    private apiPath: string = ''
    private baseUrl?: string
    private clearAuthFlag = false
    private defaultAuthToken: string
    private defaultBaseUrl: string
    private logger: APILogger
    private request: APIRequestContext
    private queryParams: object = {}

    constructor(request: APIRequestContext, apiBaseUrl: string, logger: APILogger, authToken: string = '') {
        this.request = request
        this.defaultBaseUrl = apiBaseUrl
        this.defaultAuthToken = authToken
        this.logger = logger
    }

    url(url: string) {
        this.baseUrl = url
        return this
    }

    path(path: string) {
        this.apiPath = path
        return this
    }

    params(params: object) {
        this.queryParams = params
        return this
    }

    headers(headers: Record<string, string>) {
        this.apiHeaders = headers
        return this
    }

    body(body: object) {
        this.apiBody = body
        return this
    }

    clearAuth() {
        this.clearAuthFlag = true
        return this
    }

    private getHeaders() {
        if (!this.clearAuthFlag) {
            this.apiHeaders['Authorization'] = this.apiHeaders['Authorization'] || this.defaultAuthToken
        }
        return this.apiHeaders
    }

    /**
     * Constructs the full destination URL by combining the base URL, 
     * the specific API endpoint path, and any defined query parameters.
     * * @returns {string} The complete URL as a string, including encoded search parameters.
     */
    private getUrl(): string {
        const url = new URL(`${this.baseUrl ?? this.defaultBaseUrl}${this.apiPath}`)
        for (const [key, value] of Object.entries(this.queryParams)) {
            url.searchParams.append(key, value)
        }
        return url.toString()
    }

    /**
     * Sends an HTTP POST request using the configured URL, headers, and request body.
     *
     * @param statusCode - Expected HTTP status code returned by the API
     * @returns Parsed JSON response body
     *
     * @throws Error if the actual response status does not match the expected status code
     */
    async postRequest(statusCode: number) {
        const url = this.getUrl()
        this.logger.logRequest('POST', url, this.getHeaders(), this.apiBody)

        const resp = await this.request.post(url, {
            headers: this.getHeaders(),
            data: this.apiBody
        })

        const actualStatus = resp.status()
        const respJSON = await resp.json()

        this.logger.logResponse(actualStatus, respJSON)
        this.statusCodeValidator(actualStatus, statusCode, this.postRequest)

        return respJSON
    }

    /**
     * Validates that the actual HTTP status code matches the expected one.
     *
     * If the status code does not match:
     * - It retrieves recent API logs from the logger
     * - Builds a detailed error message including expected vs actual status
     * - Attaches recent request/response activity for easier debugging
     * - Uses Error.captureStackTrace to remove this helper method from the stack trace,
     *   making the error point to the original calling method instead
     * @param actualStatus - Status code returned by the API response
     * @param expectStatus - Status code expected by the test
     * @param callingMethod - Reference to the public method that invoked this validator
     *
     * @throws Error when the actual status does not match the expected status
     */
    private statusCodeValidator(actualStatus: number, expectStatus: number, callingMethod: Function) {
        if (actualStatus !== expectStatus) {
            const logs = this.logger.getRecentLogs()
            const error = new Error(
                `Expected status ${expectStatus} but received ${actualStatus}\n\n` +
                `Recent API Activity: \n${logs}`
            )
            Error.captureStackTrace(error, callingMethod)
            throw error
        }
    }

}