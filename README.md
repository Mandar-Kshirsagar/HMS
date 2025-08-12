# Hospital Management System (HMS)

A comprehensive Hospital Management System built with **Angular 20** frontend and **.NET 8** backend, featuring modern UI/UX design, role-based authentication, and complete patient lifecycle management.

## 🏥 Project Overview

The Hospital Management System is a full-stack web application designed to streamline hospital operations including patient management, appointment scheduling, medical records, staff management, and administrative dashboards.

### Key Features

- **🔐 Authentication & Authorization**: JWT-based authentication with role-based access control
- **👥 Patient Management**: Complete patient lifecycle from registration to discharge
- **📅 Appointment Scheduling**: Advanced scheduling system with calendar views
- **📋 Medical Records**: Digital medical record management with document upload
- **👨‍⚕️ Staff Management**: User and role management for hospital staff
- **📊 Dashboard & Analytics**: Real-time insights and statistical dashboards
- **📱 Responsive Design**: Modern Material Design UI that works on all devices

## 🏗️ Architecture

### Frontend (Angular 20)
- **Framework**: Angular 20 with TypeScript
- **UI Library**: Angular Material 20
- **State Management**: Services with RxJS
- **Architecture**: Feature-based modular architecture
- **Styling**: SCSS with Angular Material theming

### Backend (.NET 8)
- **Framework**: ASP.NET Core 8 Web API
- **Database**: SQL Server with Entity Framework Core 8
- **Authentication**: JWT Bearer tokens with ASP.NET Core Identity
- **Architecture**: Clean Architecture with Domain, Application, Infrastructure layers
- **ORM**: Entity Framework Core with Code-First approach

## 📁 Project Structure

```
HMS/
├── backend/                    # .NET 8 Backend
│   ├── Hms.Api/               # Web API Layer
│   │   ├── Controllers/        # API Controllers
│   │   ├── DTOs/              # Data Transfer Objects
│   │   ├── Profiles/          # AutoMapper Profiles
│   │   └── Program.cs         # Application Entry Point
│   ├── Hms.Application/       # Application Layer
│   │   ├── Services/          # Business Logic Services
│   │   ├── Interfaces/        # Service Interfaces
│   │   └── DTOs/              # Application DTOs
│   ├── Hms.Domain/           # Domain Layer
│   │   └── Entities/         # Domain Entities
│   └── Hms.Infrastructure/   # Infrastructure Layer
│       ├── Data/             # Database Context & Migrations
│       ├── Identity/         # Identity Configuration
│       ├── Repositories/     # Data Access Layer
│       └── Services/         # Infrastructure Services
├── frontend/                 # Angular 20 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/         # Core Services & Guards
│   │   │   ├── features/     # Feature Modules
│   │   │   ├── shared/       # Shared Components
│   │   │   └── app.module.ts # Root Module
│   │   ├── environments/     # Environment Configuration
│   │   └── assets/          # Static Assets
│   ├── angular.json         # Angular Configuration
│   └── package.json         # Dependencies
└── docs/                    # Documentation
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **.NET 8 SDK**
- **SQL Server** (LocalDB or SQL Server Express)
- **Angular CLI** 20+

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HMS
   ```

2. **Backend Setup**
   ```bash
   cd backend/Hms.Api
   
   # Restore NuGet packages
   dotnet restore
   
   # Update database (creates database and applies migrations)
   dotnet ef database update --project ../Hms.Infrastructure
   
   # Run the API
   dotnet run
   ```
   
   The API will be available at `http://localhost:5000`

3. **Frontend Setup**
   ```bash
   cd frontend
   
   # Install npm packages
   npm install
   
   # Start development server
   npm start
   ```
   
   The frontend will be available at `http://localhost:4200`

### Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | Passw0rd! |
| Doctor | drsmith | Passw0rd! |
| Nurse | nurseamy | Passw0rd! |
| Receptionist | reception1 | Passw0rd! |

## 💻 Technology Stack

### Frontend Technologies
- **Angular 20**: Latest Angular framework with standalone components
- **Angular Material 20**: Material Design components
- **TypeScript**: Type-safe JavaScript
- **RxJS**: Reactive programming with observables
- **SCSS**: Enhanced CSS with variables and mixins

### Backend Technologies
- **.NET 8**: Latest .NET framework
- **ASP.NET Core 8**: Web API framework
- **Entity Framework Core 8**: ORM for database operations
- **ASP.NET Core Identity**: Authentication and authorization
- **JWT Bearer**: Token-based authentication
- **AutoMapper**: Object-to-object mapping
- **SQL Server**: Primary database

### Development Tools
- **Angular CLI**: Development tooling for Angular
- **Entity Framework CLI**: Database management
- **Swagger/OpenAPI**: API documentation
- **Visual Studio Code**: Recommended IDE

## 🔧 Configuration

### Backend Configuration

The backend uses `appsettings.json` for configuration:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=HmsDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "your-256-bit-secret-key",
    "Issuer": "HmsApi",
    "Audience": "HmsClient"
  }
}
```

### Frontend Configuration

Environment configuration in `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration (Admin only)

### Patient Management

- `GET /api/patients` - List patients with search
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create new patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

### Appointment Management

- `GET /api/appointments/doctor/{doctorId}` - Get doctor's appointments
- `POST /api/appointments` - Book new appointment
- `PUT /api/appointments/{id}/reschedule` - Reschedule appointment
- `PUT /api/appointments/{id}/cancel` - Cancel appointment

### Medical Records

- `GET /api/records/patient/{patientId}` - Get patient's medical records
- `POST /api/records` - Add new medical record

### Dashboard Analytics

- `GET /api/dashboard/summary` - Get dashboard summary statistics
- `GET /api/dashboard/visits-monthly` - Get monthly visit statistics

### Staff Management

- `GET /api/staff` - List staff members
- `POST /api/staff` - Add new staff member
- `GET /api/staff/roles` - Get available roles

## 🎨 UI/UX Features

### Modern Design System
- **Material Design 3**: Latest Material Design principles
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Dark/Light Theme**: Automatic theme switching
- **Accessibility**: WCAG 2.1 compliant components

### Interactive Components
- **Data Tables**: Sortable, filterable, paginated tables
- **Calendar Views**: Advanced appointment scheduling
- **Form Validation**: Real-time validation with error messages
- **File Upload**: Drag-and-drop document upload
- **Charts & Graphs**: Statistical data visualization

## 🔒 Security Features

### Authentication & Authorization
- **JWT Tokens**: Secure token-based authentication
- **Role-Based Access**: Different permissions for different roles
- **Route Guards**: Frontend route protection
- **API Authorization**: Backend endpoint protection

### Data Security
- **HTTPS Ready**: SSL/TLS encryption support
- **CORS Configuration**: Proper cross-origin request handling
- **Input Validation**: Server-side validation
- **SQL Injection Protection**: Entity Framework parameterized queries

## 🧪 Testing

### Running Tests

**Frontend Tests**
```bash
cd frontend
npm test              # Unit tests
npm run e2e           # End-to-end tests
```

**Backend Tests**
```bash
cd backend
dotnet test           # Unit and integration tests
```

## 📦 Deployment

### Development Deployment

1. **Backend**: 
   - Run `dotnet run` in `backend/Hms.Api`
   - Available at `http://localhost:5000`

2. **Frontend**: 
   - Run `npm start` in `frontend`
   - Available at `http://localhost:4200`

### Production Deployment

1. **Backend Production Build**
   ```bash
   dotnet publish -c Release -o ./publish
   ```

2. **Frontend Production Build**
   ```bash
   npm run build --prod
   ```

### Docker Support

Docker configurations are available for containerized deployment.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [documentation](docs/) folder for detailed guides
- Review the API documentation at `http://localhost:5000/swagger`

## 🗺️ Roadmap

### Upcoming Features
- [ ] Real-time notifications
- [ ] Advanced reporting system
- [ ] Mobile application
- [ ] Integration with external lab systems
- [ ] Telemedicine capabilities
- [ ] Billing and insurance management

## 📊 Project Statistics

- **Frontend**: ~15,000 lines of TypeScript/Angular code
- **Backend**: ~8,000 lines of C#/.NET code
- **Database**: 10+ entities with relationships
- **Features**: 25+ implemented features
- **Test Coverage**: 80%+ code coverage target

---

**Built with ❤️ for healthcare professionals**