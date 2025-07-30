employee-management-system/
│
├── src/
│ ├── config/ # DB config, environment config
│ │ └── db.js
│ │ └── dotenv.js
│ │
│ ├── controllers/ # Request handlers
│ │ ├── auth.controller.js
│ │ ├── employee.controller.js
│ │ └── admin.controller.js
│ │
│ ├── middlewares/ # Auth and error handling middleware
│ │ ├── auth.middleware.js
│ │ ├── role.middleware.js
│ │ └── error.middleware.js
│ │
│ ├── models/ # DB models or ORM schemas
│ │ └── employee.model.js
│ │
│ ├── routes/ # All route definitions
│ │ ├── auth.routes.js
│ │ ├── employee.routes.js
│ │ └── admin.routes.js
│ │
│ ├── services/ # Business logic (e.g., QR code generation)
│ │ ├── auth.service.js
│ │ ├── employee.service.js
│ │ └── qrcode.service.js
│ │
│ ├── utils/ # Utility functions (e.g., password hashing)
│ │ ├── hash.util.js
│ │ └── token.util.js
│ │
│ ├── app.js # Express app setup
│ └── server.js # Server entry point
│
├── .env # Environment variables
├── .gitignore
├── package.json
├── package-lock.json
├── node_modules
└── README.md

### 1. **Auth Routes (Login)**

**Route**: `/api/auth/login`
**Method**: `POST`

- **Request Body**:

```json
{
  "email": "favour@gbf.org",
  "password": "1Koa05JRWt14"
}
```

- **Response** (Success):

```json
{
  "token": "your_jwt_token_here"
}
```

- **Response** (Error):

```json
{
  "message": "Invalid credentials"
}
```

### 2. **Employee Routes (Authenticated User)**

**Route**: `/api/employees/me`
**Method**: `GET`

- **Headers**:

  - Authorization: `Bearer <your_jwt_token_here>`

- **Response** (Success):

```json
{
  "_id": "employee-id",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "position": "Software Engineer",
  "photo_url": "http://example.com/photo.jpg",
  "qr_code_url": "http://example.com/qr-code.png"
}
```

### 3. **Public Routes (Public Employee Profile)**

**Route**: `/api/public/employee/:id`
**Method**: `GET`

- **Response** (Success):

```json
{
  "full_name": "John Doe",
  "department": "Engineering",
  "position": "Software Engineer",
  "photo_url": "http://example.com/photo.jpg"
}
```

- **Response** (Error):

```json
{
  "message": "Employee not found"
}
```

### 4. **Admin Routes (Admin Access Only)**

#### 4.1. **Create a New Employee (Admin Only)**

**Route**: `/api/admin/employees`
**Method**: `POST`

- **Headers**:

  - Authorization: `Bearer <your_jwt_token_here>`

- **Request Body**:

```json
{
  "full_name": "Jane Doe",
  "email": "jane.doe@example.com",
  "password": "password123",
  "department": "HR",
  "position": "HR Manager",
  "photo_url": "http://example.com/photo.jpg",
  "is_admin": false
}
```

- **Response** (Success):

```json
{
  "_id": "new-employee-id",
  "full_name": "Jane Doe",
  "email": "jane.doe@example.com",
  "department": "HR",
  "position": "HR Manager",
  "photo_url": "http://example.com/photo.jpg",
  "is_admin": false,
  "qr_code_url": "http://example.com/qr-code.png"
}
```

- **Response** (Error):

```json
{
  "message": "Email already in use"
}
```

#### 4.2. **Get All Employees (Admin Only)**

**Route**: `/api/admin/employees`
**Method**: `GET`

- **Headers**:

  - Authorization: `Bearer <your_jwt_token_here>`

- **Response** (Success):

```json
[
  {
    "_id": "employee-id",
    "full_name": "John Doe",
    "email": "john.doe@example.com",
    "department": "Engineering",
    "position": "Software Engineer",
    "photo_url": "http://example.com/photo.jpg",
    "qr_code_url": "http://example.com/qr-code.png"
  },
  {
    "_id": "another-employee-id",
    "full_name": "Jane Doe",
    "email": "jane.doe@example.com",
    "department": "HR",
    "position": "HR Manager",
    "photo_url": "http://example.com/photo2.jpg",
    "qr_code_url": "http://example.com/qr-code2.png"
  }
]
```

#### 4.3. **Get an Employee by ID (Admin Only)**

**Route**: `/api/admin/employees/:id`
**Method**: `GET`

- **Headers**:

  - Authorization: `Bearer <your_jwt_token_here>`

- **Response** (Success):

```json
{
  "_id": "employee-id",
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "department": "Engineering",
  "position": "Software Engineer",
  "photo_url": "http://example.com/photo.jpg",
  "qr_code_url": "http://example.com/qr-code.png"
}
```

- **Response** (Error):

```json
{
  "message": "Employee not found"
}
```

#### 4.4. **Update Employee Details (Admin Only)**

**Route**: `/api/admin/employees/:id`
**Method**: `PUT`

- **Headers**:

  - Authorization: `Bearer <your_jwt_token_here>`

- **Request Body**:

```json
{
  "full_name": "John Smith",
  "email": "john.smith@example.com",
  "department": "Engineering",
  "position": "Lead Developer",
  "photo_url": "http://example.com/photo-updated.jpg",
  "is_admin": false
}
```

- **Response** (Success):

```json
{
  "_id": "employee-id",
  "full_name": "John Smith",
  "email": "john.smith@example.com",
  "department": "Engineering",
  "position": "Lead Developer",
  "photo_url": "http://example.com/photo-updated.jpg",
  "is_admin": false,
  "qr_code_url": "http://example.com/qr-code-updated.png"
}
```

- **Response** (Error):

```json
{
  "message": "Employee not found"
}
```

#### 4.5. **Delete an Employee (Admin Only)**

**Route**: `/api/admin/employees/:id`
**Method**: `DELETE`

- **Headers**:

  - Authorization: `Bearer <your_jwt_token_here>`

- **Response** (Success):

```json
{
  "message": "Employee deleted successfully"
}
```

- **Response** (Error):

```json
{
  "message": "Employee not found"
}
```

#### 4.6. **Get the QR Code for an Employee (Admin Only)**

**Route**: `/api/admin/qr/:id`
**Method**: `GET`

- **Headers**:

  - Authorization: `Bearer <your_jwt_token_here>`

- **Response** (Success):

```json
{
  "qr_code_url": "http://example.com/qr-code.png"
}
```

### Summary of Endpoints:

- `/api/auth/login` - `POST` - Login an employee
- `/api/employees/me` - `GET` - Get the authenticated employee's details
- `/api/public/employee/:id` - `GET` - Get a public employee profile
- `/api/admin/employees` - `POST` - Create a new employee (Admin)
- `/api/admin/employees` - `GET` - Get all employees (Admin)
- `/api/admin/employees/:id` - `GET` - Get employee by ID (Admin)
- `/api/admin/employees/:id` - `PUT` - Update an employee (Admin)
- `/api/admin/employees/:id` - `DELETE` - Delete an employee (Admin)
- `/api/admin/qr/:id` - `GET` - Get QR code for an employee (Admin)

### Testing Tips:

- **Authentication**: For any route requiring authentication, you'll need to include the JWT token in the request headers (`Authorization: Bearer <your_jwt_token_here>`).
- **Admin Roles**: Routes like `createEmployee`, `getAllEmployees`, `updateEmployee`, etc., are protected by the `roleMiddleware("admin")`, so ensure you're testing with an admin account.
