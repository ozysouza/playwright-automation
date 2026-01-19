# Conduit API Automation

Automated API tests for [Conduit](https://conduit.bondaracademy.com/) using **Playwright**.  
This project centralizes API requests, schema validation, and logging to create a robust automation suite.

---

## Project Overview

- Centralized API request handling with `RequestHandler`
- Response schema validation using **AJV**
- Custom Playwright matcher `toMatchSchema()` for easy schema checks
- Worker-scoped authentication token for efficient API tests
- Detailed logging of requests and responses
- Flexible fixture architecture for easy expansion

This suite currently targets Conduit's API but can be extended to other sites/projects.

---

## Tech Stack

- **Node.js**
- **TypeScript**
- **Playwright Test**
- **AJV** – JSON schema validation
- **dotenv** – environment variable management

---

## Authentication Strategy

- Authentication token is generated **once per worker**
- Uses Playwright **worker-scoped fixtures**
- Token is injected automatically into all requests

This improves:
- Test performance
- Test isolation
- Stability in parallel runs

---

## Environment Setup

### 1 Clone the repository

```bash
git https://github.com/ozysouza/playwright-automation.git
cd pw-conduit-api
```
### 2 Install depedencies
```bash
npm init -y
npm install
npx playwright install
```
### 3 Env file
- Create a .env file in the project root:
```bash
CONDUIT_API_URL=https://conduit-api.bondaracademy.com/api
CONDUIT_API_USER_EMAIL=pwtest3412@test.com
CONDUIT_API_USER_PASSWORD=pwtest3412
```

## 📦 API Request Abstraction

All HTTP methods are centralized in the `RequestHandler` class:

- `getRequest`
- `postRequest`
- `putRequest`
- `deleteRequest`

Each request:

- Logs request and response details
- Validates expected HTTP status codes
- Returns the parsed JSON response
- Supports authentication and custom headers

---

## 📐 Schema Validation

AJV is used to validate API responses against stored JSON schemas.


