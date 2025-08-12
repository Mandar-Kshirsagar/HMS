# Hospital Management System (HMS)

This is the documentation for the Hospital Management System (HMS), a web application with a .NET backend and an Angular frontend.

## Architecture

The application is divided into two main parts:

*   **Backend**: A .NET Core application that provides a RESTful API for the frontend. It follows a layered architecture with `Domain`, `Application`, and `Infrastructure` projects.
*   **Frontend**: An Angular application that provides the user interface for the application.

## Backend Setup

To run the backend server, follow these steps:

1.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
2.  Restore the .NET dependencies:
    ```bash
    dotnet restore
    ```
3.  Run the application:
    ```bash
    dotnet run --project Hms.Api
    ```
The backend will be running on `http://localhost:5000`.

## Frontend Setup

To run the frontend application, follow these steps:

1.  Navigate to the `frontend/hms-frontend` directory:
    ```bash
    cd frontend/hms-frontend
    ```
2.  Install the npm dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    ng serve
    ```
The frontend will be running on `http://localhost:4200/`.

## Features

The Hospital Management System includes the following features:

*   **Authentication**: User login and registration.
*   **Dashboard**: A dashboard to display summary information.
*   **Patients**: Manage patient information.
*   **Appointments**: Manage appointments.
*   **Medical Records**: Manage medical records for patients.
*   **Documents**: Manage documents.
*   **Staff**: Manage staff information.
