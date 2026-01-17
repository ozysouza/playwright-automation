import { APIRequestContext, expect } from "@playwright/test"

export class RequestHandler {

    private apiBody: object = {}
    private apiHeaders: object = {}
    private apiPath: string = ''
    private baseUrl?: string
    private defaultBaseUrl: string
    private request: APIRequestContext
    private queryParams: object = {}

    constructor(request: APIRequestContext, apiBaseUrl: string) {
        this.request = request
        this.defaultBaseUrl = apiBaseUrl
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

}