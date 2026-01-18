import fs from 'fs/promises'
import path from 'path'
import Ajv from 'ajv'
import { createSchema } from 'genson-js'

const SCHEMA_BASE_PATH = path.resolve(__dirname, '..', 'response-schemas')
const ajv = new Ajv({ allErrors: true })

/**
 * Validates an API response body against a JSON Schema.
 *
 * Optionally generates a new schema file if one does not exist
 * or if schema creation is explicitly requested.
 *
 * @param dirName - Directory name under `response-schemas` (e.g. `tags`, `articles`)
 * @param fileName - Schema file prefix (e.g. `GET_tags` → `GET_tags_schema.json`)
 * @param respBody - Actual API response body to validate
 * @param createSchemaFlag - When true, generates or overwrites the schema file
 *
 * @throws Error if schema loading fails or validation does not pass
 */
export async function validateSchema(dirName: string, fileName: string, respBody: object, createSchemaFlag: boolean = false): Promise<void> {
    const schemaPath = path.join(
        SCHEMA_BASE_PATH,
        dirName,
        `${fileName}_schema.json`
    )

    if (createSchemaFlag) {
        await generateNewSchema(respBody, schemaPath)
    }

    const schema = await loadSchema(schemaPath)
    const validate = ajv.compile(schema)

    const valid = validate(respBody)
    if (!valid) {
        throw new Error(
            `Schema validation failed for ${fileName}_schema.json:\n` +
            `${JSON.stringify(validate.errors, null, 4)}\n\n` +
            `Actual response body:\n` +
            `${JSON.stringify(respBody, null, 4)}`
        )
    }
}

/**
 * Loads and parses a JSON schema file from disk.
 *
 * @param schemaPath - Absolute path to the schema file
 * @returns Parsed JSON schema object
 *
 * @throws Error if the file cannot be read or parsed
 */
async function loadSchema(schemaPath: string): Promise<object> {
    try {
        const schemaContent = await fs.readFile(schemaPath, 'utf-8')
        return JSON.parse(schemaContent)
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to read the schema file: ${error.message}`)
        }
        throw new Error(`Failed to read the schema file: ${String(error)}`)
    }
}

/**
 * Generates a JSON Schema from an API response body and writes it to disk.
 * The directory structure is created automatically if it does not exist.
 *
 * @param responseBody - API response body used to generate the schema
 * @param schemaPath - Absolute path where the schema file will be written
 *
 * @throws Error if schema generation or file writing fails
 */
async function generateNewSchema(responseBody: object, schemaPath: string): Promise<void> {
    try {
        const generatedSchema = createSchema(responseBody)
        await fs.mkdir(path.dirname(schemaPath), { recursive: true })
        await fs.writeFile(schemaPath, JSON.stringify(generatedSchema, null, 4))
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to create schema file: ${error.message}`)
        }
        throw new Error(`Failed to create schema file: ${String(error)}`)
    }
}
