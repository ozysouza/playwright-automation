# 🎭 Playwright Automation Repository

This repository contains in-progress end-to-end test automation projects built with **Playwright + TypeScript**.

It is designed as a **multi-site automation workspace**, where each application or website under test lives in its own isolated folder while sharing common Playwright best practices and patterns.

The pw-web-app folder is my main automation toolbox. It will be continuously used and extended over time, and additional folders will be added in the future to automate different websites and applications.

**Tech Stack**
- Playwright
- TypeScript
- Page Object Model (POM)
- Playwright Fixtures
- Faker.js for test data generation
- API + UI test support

**Design Principles**

This repository follows these core automation principles:

*Page Object Model*
- UI interactions and assertions live in page classes.

*Fixtures for dependency injection*
- Page objects and helpers are injected using Playwright fixtures.

*Clear separation of concerns*
- pages/ → UI behaviour
- fixtures/ → test wiring
- helpers/ → API operations & side effects
- utils/ → pure functions (faker, formatting)

## ▶️ Running Tests

Navigate to the folder you want to run tests for:

```bash
cd tests/playwright
npm install
npx playwright test
```

Run a specific test file:
```bash
npx playwright test pw-web-app/tests/playwright/tests/forms/main/formLayouts.spec.ts
```

Run a test by name:
```bash
npx playwright test pw-web-app/tests/playwright/tests/forms/main/formLayouts.spec.ts -g "User can sign in using the Grid form."
```

**Goals of This Repository**

*Practice and showcase modern Playwright automation*

- Maintain clean, scalable test architecture
- Support multiple applications in one workspace
- Serve as a reference for real-world test automation projects

**Author**

Oziel De Souza

QA Engineer | CTFL & AWS Certified
Automation | API Testing | Cloud | CI/CD
