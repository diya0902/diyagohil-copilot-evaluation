# Task Management API

A RESTful API for managing tasks with full CRUD operations, built with Express.js and TypeScript.

## Features

- ✅ Create, Read, Update, and Delete tasks
- ✅ In-memory storage (no database required)
- ✅ Input validation and error handling
- ✅ Filter tasks by status
- ✅ TypeScript for type safety
- ✅ RESTful API design

## Task Model

```typescript
{
  id: string;           // UUID v4
  title: string;        // Max 200 characters
  description: string;  // Max 1000 characters
  status: TaskStatus;   // TODO | IN_PROGRESS | COMPLETED
  priority: TaskPriority; // LOW | MEDIUM | HIGH
  dueDate?: Date;       // Optional due date (Required for HIGH priority)
  createdAt: Date;
  updatedAt: Date;
}
```

## API Endpoints

### 1. Create Task
**POST** `/api/tasks`

**Request Body:**
```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive README with API examples",
  "status": "TODO",  // Optional, defaults to TODO
  "priority": "MEDIUM",  // Optional, defaults to MEDIUM (LOW | MEDIUM | HIGH)
  "dueDate": "2026-03-15"  // Optional, ISO 8601 format (Required for HIGH priority)
}
```

**Response:** `201 Created`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation",
  "description": "Write comprehensive README with API examples",
  "status": "TODO",
  "priority": "MEDIUM",
  "dueDate": "2026-03-15T00:00:00.000Z",
  "createdAt": "2026-02-20T10:30:00.000Z",
  "updatedAt": "2026-02-20T10:30:00.000Z"
}
```

---

### 2. Get All Tasks
**GET** `/api/tasks`

**Query Parameters:**
- `status` (optional): Filter by status (TODO, IN_PROGRESS, COMPLETED)
- `sortBy` (optional): Sort by due date
  - `dueDate:asc` - Sort by due date in ascending order (earliest first)
  - `dueDate:desc` - Sort by due date in descending order (latest first)

**Examples:** 
- `/api/tasks?status=IN_PROGRESS`
- `/api/tasks?sortBy=dueDate:asc`
- `/api/tasks?status=TODO&sortBy=dueDate:desc`

**Response:** `200 OK`
```json
{
  "count": 2,
  "tasks": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Complete project documentation",
      "description": "Write comprehensive README with API examples",
      "status": "TODO",
      "priority": "MEDIUM",
      "dueDate": "2026-03-15T00:00:00.000Z",
      "createdAt": "2026-02-20T10:30:00.000Z",
      "updatedAt": "2026-02-20T10:30:00.000Z"
    },
    {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "title": "Review code",
      "description": "Review pull requests from team members",
      "status": "IN_PROGRESS",
      "priority": "HIGH",
      "dueDate": "2026-03-20T00:00:00.000Z",
      "createdAt": "2026-02-20T11:00:00.000Z",
      "updatedAt": "2026-02-20T11:15:00.000Z"
    }
  ]
}
```

**Note:** When sorting by due date, tasks without a due date will appear at the end of the list.

---

### 3. Get Task by ID
**GET** `/api/tasks/:id`

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation",
  "description": "Write comprehensive README with API examples",
  "status": "TODO",
  "priority": "MEDIUM",
  "dueDate": "2026-03-15T00:00:00.000Z",
  "createdAt": "2026-02-20T10:30:00.000Z",
  "updatedAt": "2026-02-20T10:30:00.000Z"
}
```

**Error Response:** `404 Not Found`
```json
{
  "error": "Task not found"
}
```

---

### 4. Update Task
**PUT** `/api/tasks/:id`

**Request Body:** (all fields optional, but at least one required)
```json
{
  "title": "Complete project documentation - Updated",
  "description": "Write comprehensive README with detailed API examples",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-02-25"
}
```

**Response:** `200 OK`
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "title": "Complete project documentation - Updated",
  "description": "Write comprehensive README with detailed API examples",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2026-02-25T00:00:00.000Z",
  "createdAt": "2026-02-20T10:30:00.000Z",
  "updatedAt": "2026-02-20T12:00:00.000Z"
}
```

---

### 5. Delete Task
**DELETE** `/api/tasks/:id`

**Response:** `200 OK`
```json
{
  "message": "Task deleted successfully",
  "task": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Complete project documentation",
    "description": "Write comprehensive README with API examples",
    "status": "TODO",
    "priority": "MEDIUM",
    "dueDate": "2026-03-15T00:00:00.000Z",
    "createdAt": "2026-02-20T10:30:00.000Z",
    "updatedAt": "2026-02-20T10:30:00.000Z"
  }
}
```

---

### 6. Delete All Tasks
**DELETE** `/api/tasks`

⚠️ **Warning:** This endpoint deletes all tasks. Use with caution!

**Response:** `200 OK`
```json
{
  "message": "All tasks deleted successfully",
  "count": 5
}
```

---

## Status Values

Tasks can have one of three statuses:

- `TODO` - Task is pending
- `IN_PROGRESS` - Task is being worked on
- `COMPLETED` - Task is finished

---

## Priority Values

Tasks can have one of three priority levels:

- `LOW` - Low priority task
- `MEDIUM` - Medium priority task (default)
- `HIGH` - High priority task (requires due date within 7 days)

**Important:** High priority tasks must have a due date that is:
- Not in the past
- Within 7 days from today

---

## Validation Rules

### Create Task
- `title`: Required, non-empty string, max 200 characters
- `description`: Required, non-empty string, max 1000 characters
- `status`: Optional, must be one of: TODO, IN_PROGRESS, COMPLETED
- `priority`: Optional, must be one of: LOW, MEDIUM, HIGH (defaults to MEDIUM)
- `dueDate`: Optional for LOW/MEDIUM priority, Required for HIGH priority
  - Must be valid ISO 8601 date format (e.g., 2026-12-31 or 2026-12-31T23:59:59)
  - For HIGH priority: must be within 7 days from today and not in the past

### Update Task
- At least one field must be provided
- `title`: If provided, must be non-empty string, max 200 characters
- `description`: If provided, must be non-empty string, max 1000 characters
- `status`: If provided, must be one of: TODO, IN_PROGRESS, COMPLETED
- `priority`: If provided, must be one of: LOW, MEDIUM, HIGH
  - If changing to HIGH priority: dueDate must be provided and within 7 days
- `dueDate`: If provided, must be valid ISO 8601 date format

### Task ID
- Must be a valid UUID v4 format

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Title is required"
}
```

### 404 Not Found
```json
{
  "error": "Task not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error message"
}
```

---

## Testing with cURL

### Create a task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "status": "TODO",
    "priority": "MEDIUM",
    "dueDate": "2026-03-30"
  }'
```

### Create a high priority task (must have due date within 7 days)
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Urgent Bug Fix",
    "description": "Fix critical production bug",
    "status": "TODO",
    "priority": "HIGH",
    "dueDate": "2026-02-25"
  }'
```

### Get all tasks
```bash
curl http://localhost:3000/api/tasks
```

### Get tasks by status
```bash
curl http://localhost:3000/api/tasks?status=IN_PROGRESS
```

### Get tasks sorted by due date (ascending)
```bash
curl "http://localhost:3000/api/tasks?sortBy=dueDate:asc"
```

### Get tasks sorted by due date (descending)
```bash
curl "http://localhost:3000/api/tasks?sortBy=dueDate:desc"
```

### Get tasks with status filter and sorting
```bash
curl "http://localhost:3000/api/tasks?status=TODO&sortBy=dueDate:asc"
```

### Get task by ID
```bash
curl http://localhost:3000/api/tasks/{task-id}
```

### Update a task
```bash
curl -X PUT http://localhost:3000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "COMPLETED",
    "priority": "LOW"
  }'
```

### Update to high priority (requires due date within 7 days)
```bash
curl -X PUT http://localhost:3000/api/tasks/{task-id} \
  -H "Content-Type: application/json" \
  -d '{
    "priority": "HIGH",
    "dueDate": "2026-02-27"
  }'
```

### Delete a task
```bash
curl -X DELETE http://localhost:3000/api/tasks/{task-id}
```

### Delete all tasks
```bash
curl -X DELETE http://localhost:3000/api/tasks
```

---

## Project Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── health.controller.ts
│   │   └── task.controller.ts      # Task CRUD operations
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── validation.ts           # Request validation middleware
│   ├── models/
│   │   └── task.model.ts           # Task interface and DTOs
│   ├── routes/
│   │   ├── health.routes.ts
│   │   └── task.routes.ts          # Task API endpoints
│   ├── app.ts
│   └── server.ts
├── package.json
└── tsconfig.json
```

---

## Dependencies

- **express**: Web framework
- **uuid**: Generate unique IDs
- **dotenv**: Environment variables
- **TypeScript**: Type safety

---

## Running the Server

```bash
# Install dependencies
npm install

# Development mode (with auto-reload)
npm run dev

# Build
npm run build

# Production mode
npm start
```

The server will run on `http://localhost:3000` (or the port specified in `.env`).

---

## Notes

- This implementation uses **in-memory storage**, so all data will be lost when the server restarts
- For production use, consider integrating a database (MongoDB, PostgreSQL, etc.)
- All timestamps are stored as JavaScript Date objects
- Task IDs are generated using UUID v4 for guaranteed uniqueness
