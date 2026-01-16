type RequestLog = {
    method: string
    url: string
    headers: Record<string, string>
    body?: unknown
}

type ResponseLog = {
    statusCode: number
    body?: unknown
}

type LogEntry =
    | { type: 'REQUEST'; timestamp: string; data: RequestLog }
    | { type: 'RESPONSE'; timestamp: string; data: ResponseLog }

export class APILogger {
    private recentLogs: LogEntry[] = []
    private readonly maxLogs = 20

    logRequest(method: string, url: string, headers: Record<string, string>, body?: unknown) {
        this.addLog({
            type: 'REQUEST',
            timestamp: new Date().toISOString(),
            data: { method, url, headers, body },
        })
    }

    logResponse(statusCode: number, body?: unknown) {
        this.addLog({
            type: 'RESPONSE',
            timestamp: new Date().toISOString(),
            data: { statusCode, body },
        })
    }

    getRecentLogs(): string {
        return this.recentLogs
            .map(log => {
                return (
                    `=== ${log.type} | ${log.timestamp} ===\n` +
                    JSON.stringify(log.data, null, 2)
                )
            })
            .join('\n\n')
    }

    clear() {
        this.recentLogs = []
    }

    private addLog(entry: LogEntry) {
        this.recentLogs.push(entry)

        if (this.recentLogs.length > this.maxLogs) {
            this.recentLogs.shift()
        }
    }
}
