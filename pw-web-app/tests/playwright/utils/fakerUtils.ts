import { faker } from '@faker-js/faker'

export function emailAddress(): string {
    return faker.internet.email({
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        provider: 'example.com',
    })
}

export function fullName(): string {
    return faker.person.fullName()
}

export function password(): string {
    return faker.internet.password({ length: 12 })
}