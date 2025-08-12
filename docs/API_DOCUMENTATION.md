# API Documentation

## Overview

The HMS API is built using ASP.NET Core 8 Web API and follows RESTful principles. All endpoints require JWT authentication unless otherwise specified.

## Base URL

```
http://localhost:5000/api
```

## Authentication

### JWT Token Authentication

All API requests require a valid JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### Login Endpoint

**POST** `/auth/login`

Authenticate a user and receive a JWT token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "roles": ["Admin", "Doctor"]
}
```

**Response Codes:**
- `200 OK` - Successful authentication
- `401 Unauthorized` - Invalid credentials

---

## Patient Management

### Get All Patients

**GET** `/patients`

Retrieve a list of patients with optional search functionality.

**Query Parameters:**
- `q` (optional): Search query for patient name, ID, or contact

**Response:**
```json
[
  {
    "id": "guid",
    "fullName": "John Doe",
    "dateOfBirth": "1990-01-01T00:00:00Z",
    "gender": "Male",
    "contact": "555-0123",
    "address": "123 Main St",
    "applicationUserId": "user-guid"
  }
]
```

### Get Patient by ID

**GET** `/patients/{id}`

Retrieve a specific patient by their unique identifier.

**Path Parameters:**
- `id`: Patient GUID

**Response:**
```json
{
  "id": "guid",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "gender": "Male",
  "contact": "555-0123",
  "address": "123 Main St",
  "applicationUserId": "user-guid"
}
```

### Create Patient

**POST** `/patients`

Create a new patient record.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "gender": "Male",
  "contact": "555-0123",
  "address": "123 Main St"
}
```

**Response:**
```json
{
  "id": "generated-guid",
  "fullName": "John Doe",
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "gender": "Male",
  "contact": "555-0123",
  "address": "123 Main St",
  "applicationUserId": null
}
```

### Update Patient

**PUT** `/patients/{id}`

Update an existing patient record.

**Path Parameters:**
- `id`: Patient GUID

**Request Body:**
```json
{
  "fullName": "John Smith",
  "dateOfBirth": "1990-01-01T00:00:00Z",
  "gender": "Male",
  "contact": "555-0124",
  "address": "456 Oak St"
}
```

**Response:** `204 No Content`

---

## Appointment Management

### Get Doctor's Appointments

**GET** `/appointments/doctor/{doctorUserId}`

Retrieve appointments for a specific doctor.

**Path Parameters:**
- `doctorUserId`: Doctor's user ID

**Query Parameters:**
- `day` (optional): Filter by specific date (ISO 8601 format)

**Response:**
```json
[
  {
    "id": 1,
    "patientId": "patient-guid",
    "doctorUserId": "doctor-user-id",
    "start": "2024-01-15T10:00:00Z",
    "end": "2024-01-15T10:30:00Z",
    "status": "Scheduled",
    "reason": "Regular checkup"
  }
]
```

### Book Appointment

**POST** `/appointments`

Create a new appointment.

**Request Body:**
```json
{
  "patientId": "patient-guid",
  "doctorUserId": "doctor-user-id",
  "start": "2024-01-15T10:00:00Z",
  "end": "2024-01-15T10:30:00Z",
  "status": "Scheduled",
  "reason": "Regular checkup"
}
```

**Response:**
```json
{
  "id": 1,
  "patientId": "patient-guid",
  "doctorUserId": "doctor-user-id",
  "start": "2024-01-15T10:00:00Z",
  "end": "2024-01-15T10:30:00Z",
  "status": "Scheduled",
  "reason": "Regular checkup"
}
```

### Reschedule Appointment

**PUT** `/appointments/{id}/reschedule`

Reschedule an existing appointment.

**Path Parameters:**
- `id`: Appointment ID

**Request Body:**
```json
"2024-01-16T10:00:00Z"
```

**Response:** `204 No Content`

### Cancel Appointment

**PUT** `/appointments/{id}/cancel`

Cancel an existing appointment.

**Path Parameters:**
- `id`: Appointment ID

**Response:** `204 No Content`

---

## Medical Records

### Get Patient's Medical Records

**GET** `/records/patient/{patientId}`

Retrieve all medical records for a specific patient.

**Path Parameters:**
- `patientId`: Patient GUID

**Response:**
```json
[
  {
    "id": 1,
    "patientId": "patient-guid",
    "doctorUserId": "doctor-user-id",
    "visitDate": "2024-01-15T14:30:00Z",
    "diagnosis": "Hypertension",
    "prescription": "Lisinopril 10mg daily",
    "treatmentPlan": "Monitor blood pressure, follow-up in 3 months",
    "notes": "Patient reports feeling well"
  }
]
```

### Add Medical Record

**POST** `/records`

Add a new medical record for a patient.

**Request Body:**
```json
{
  "patientId": "patient-guid",
  "doctorUserId": "doctor-user-id",
  "visitDate": "2024-01-15T14:30:00Z",
  "diagnosis": "Hypertension",
  "prescription": "Lisinopril 10mg daily",
  "treatmentPlan": "Monitor blood pressure, follow-up in 3 months",
  "notes": "Patient reports feeling well"
}
```

**Response:**
```json
{
  "id": 1,
  "patientId": "patient-guid",
  "doctorUserId": "doctor-user-id",
  "visitDate": "2024-01-15T14:30:00Z",
  "diagnosis": "Hypertension",
  "prescription": "Lisinopril 10mg daily",
  "treatmentPlan": "Monitor blood pressure, follow-up in 3 months",
  "notes": "Patient reports feeling well"
}
```

---

## Document Management

### Get Patient's Documents

**GET** `/documents/patient/{patientId}`

Retrieve all documents for a specific patient.

**Path Parameters:**
- `patientId`: Patient GUID

**Response:**
```json
[
  {
    "id": 1,
    "patientId": "patient-guid",
    "fileName": "lab_report.pdf",
    "filePath": "/uploads/patient-guid/lab_report.pdf",
    "contentType": "application/pdf",
    "uploadedAt": "2024-01-15T16:00:00Z"
  }
]
```

### Upload Document

**POST** `/documents/upload/{patientId}`

Upload a document for a specific patient.

**Path Parameters:**
- `patientId`: Patient GUID

**Request Body:** `multipart/form-data`
- `file`: File to upload

**Response:**
```json
{
  "id": 1,
  "patientId": "patient-guid",
  "fileName": "lab_report.pdf",
  "filePath": "/uploads/patient-guid/lab_report.pdf",
  "contentType": "application/pdf",
  "uploadedAt": "2024-01-15T16:00:00Z"
}
```

---

## Dashboard & Analytics

### Get Dashboard Summary

**GET** `/dashboard/summary`

Retrieve key statistics for the dashboard.

**Response:**
```json
{
  "totalPatients": 150,
  "totalDoctors": 12,
  "appointmentsToday": 25
}
```

### Get Monthly Visits

**GET** `/dashboard/visits-monthly`

Retrieve monthly visit statistics.

**Query Parameters:**
- `year`: Year for statistics (default: current year)

**Response:**
```json
[
  {
    "month": 1,
    "visits": 45
  },
  {
    "month": 2,
    "visits": 52
  }
]
```

---

## Staff Management

### Get All Staff

**GET** `/staff`

Retrieve all staff members.

**Response:**
```json
[
  {
    "id": "user-guid",
    "userName": "drsmith",
    "email": "drsmith@hms.local",
    "fullName": "Dr. John Smith",
    "roles": ["Doctor"]
  }
]
```

### Create Staff Member

**POST** `/staff`

Create a new staff member.

**Request Body:**
```json
{
  "username": "drjones",
  "email": "drjones@hms.local",
  "fullName": "Dr. Jane Jones",
  "password": "SecurePassword123!",
  "role": "Doctor"
}
```

**Response:**
```json
{
  "id": "generated-guid",
  "userName": "drjones",
  "email": "drjones@hms.local",
  "fullName": "Dr. Jane Jones",
  "roles": ["Doctor"]
}
```

### Get Available Roles

**GET** `/staff/roles`

Retrieve all available system roles.

**Response:**
```json
["Admin", "Doctor", "Nurse", "Receptionist", "Patient"]
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "type": "https://tools.ietf.org/html/rfc7231#section-6.5.1",
  "title": "Bad Request",
  "status": 400,
  "errors": {
    "FullName": ["The FullName field is required."]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "message": "Forbidden"
}
```

### 404 Not Found
```json
{
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "message": "An error occurred while processing your request."
}
```

---

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Per User**: 1000 requests per hour
- **Per IP**: 5000 requests per hour

---

## Versioning

The API uses URL versioning:
- Current version: `v1` (default)
- Future versions: `v2`, `v3`, etc.

Example: `/api/v1/patients`

---

## CORS Policy

The API is configured to accept requests from:
- `http://localhost:4200` (Development frontend)
- Production frontend domains (when deployed)

---

## OpenAPI/Swagger

Interactive API documentation is available at:
- Development: `http://localhost:5000/swagger`
- Swagger JSON: `http://localhost:5000/swagger/v1/swagger.json`
