type ApiTestConfig = {
    apiUrl: string
    userEmail: string
    userName: string
    userPassword: string
}

function requireEnv(name: string): string {
    const value = process.env[name]
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`)
    }
    return value
}

function optionalEnv(name: string): string | undefined {
    return process.env[name]
}

export const config: ApiTestConfig = {
    apiUrl: requireEnv('CONDUIT_API_URL'),
    userEmail: requireEnv('CONDUIT_API_USER_EMAIL'),
    userName: requireEnv('CONDUIT_API_USER_NAME'),
    userPassword: requireEnv('CONDUIT_API_USER_PASSWORD'),
}
