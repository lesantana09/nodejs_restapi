# Node.js REST API

This project is a learning-focused Node.js REST API for managing transactions. It is built using **Fastify** for efficient request handling and **Knex** for database interactions. The API allows users to create, retrieve, and summarize transaction records, with session-based identification for user-specific data segregation.

---

## Features

- **Session-Based Transactions:**
  - Each transaction is tied to a unique `sessionId`, ensuring secure and user-specific data access.

- **CRUD Operations:**
  - **Create** a transaction
  - **Retrieve** transactions by ID or list all transactions
  - **Summarize** transactions with a calculated total

- **Middleware Support:**
  - Pre-handler middleware for session validation: This middleware checks the validity of the session before processing each request, ensuring that only authenticated and authorized users can perform operations.

- **Type Safety:**
  - Uses **Zod** for request validation: Zod is a TypeScript-first schema description language and data validator. It helps to define the shape of the data expected in requests and automatically handles validation, providing a robust and error-free experience.

---

## Prerequisites

- Node.js >= 18.x
- SQLite3 (used as the database)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/lesantana09/nodejs_restapi.git
   cd nodejs_restapi
    ```

2. Install dependencies:
```bash
    npm install
```

3. Set up the database:

Ensure SQLite3 is installed on your system.
Run the migrations to set up the database schema

```bash
    npx knex migrate:latest
```