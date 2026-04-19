# image-uploader
The application allows you to save images to local storage and retrieve image metadata from a database. Allowed file extensions are: `jpeg`, `png`, `gif`, and `webp`.

### Prerequisites
The application requires Docker and Docker Compose to run, targeting **Node 24**. 
All dependencies are managed with `pnpm`.

### Installation
Copy `.env.example` to `.env` and fill in your database credentials.
#### Docker:
```sh
docker compose up --build
```
#### Local:
```sh
pnpm install
pnpm develop
```

### Swagger
The API documentation and schema definitions are auto-generated. Once running, you can access the Swagger UI at:
```
http://localhost:4000/docs/
```

### Tests
Tests can be run with:
```sh
pnpm test
```

### Architectural decisions
The project is built upon Clean Architecture and SOLID principles:

- Separation of Concerns: Logic is split into TSOA controllers for API handling, services for image processing with sharp, and Kysely repositories for database access. Dependency Injection making services easier to test and replace. 

- Testing Strategy: I used the Fake Pattern for unit tests to keep them fast. For integration tests, I used Testcontainers to verify real PostgreSQL migrations and queries.

- Domain Integrity: The Image model handles its own UUID generation and basic title validation instead of relying on the database or service to do it.

- Type Safety: The app uses Kysely for type-safe SQL.