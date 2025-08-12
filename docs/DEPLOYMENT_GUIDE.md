# Deployment Guide

## Overview

This guide covers the deployment of the HMS (Hospital Management System) for both development and production environments. The system consists of a .NET 8 backend API and an Angular 20 frontend application.

## System Requirements

### Development Environment
- **Operating System**: Windows 10/11, macOS, or Linux
- **Node.js**: 18.x or later
- **npm**: 9.x or later
- **.NET SDK**: 8.0 or later
- **Database**: SQL Server Express 2019+ or SQL Server LocalDB
- **IDE**: Visual Studio Code (recommended) or Visual Studio 2022

### Production Environment
- **Operating System**: Windows Server 2019+ or Linux (Ubuntu 20.04+)
- **Runtime**: .NET 8.0 Runtime
- **Database**: SQL Server 2019+ or Azure SQL Database
- **Web Server**: IIS 10+ (Windows) or Nginx (Linux)
- **Memory**: 4 GB RAM minimum, 8 GB recommended
- **Storage**: 50 GB minimum, SSD recommended

## Local Development Setup

### Prerequisites Installation

#### 1. Install Node.js and npm
```bash
# Download from https://nodejs.org/
# Verify installation
node --version  # Should be 18.x or later
npm --version   # Should be 9.x or later
```

#### 2. Install .NET 8 SDK
```bash
# Download from https://dotnet.microsoft.com/download
# Verify installation
dotnet --version  # Should be 8.0.x
```

#### 3. Install Angular CLI
```bash
npm install -g @angular/cli@20
ng version  # Verify installation
```

#### 4. Install SQL Server Express
```bash
# Download from Microsoft SQL Server website
# Or use SQL Server LocalDB for development
```

### Backend Setup

#### 1. Clone and Setup Backend
```bash
cd HMS/backend/Hms.Api

# Restore NuGet packages
dotnet restore

# Verify build
dotnet build
```

#### 2. Configure Database Connection

**appsettings.Development.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=.\\SQLEXPRESS;Database=HmsDb;Trusted_Connection=True;TrustServerCertificate=True;"
  },
  "Jwt": {
    "Key": "hms_jwt_secret_key_256_bit_minimum_required_for_hs256_algorithm_security",
    "Issuer": "HmsApi",
    "Audience": "HmsClient"
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Information"
    }
  }
}
```

#### 3. Initialize Database
```bash
# Create and update database (from Hms.Infrastructure directory)
cd ../Hms.Infrastructure
dotnet ef database update --startup-project ../Hms.Api

# Alternatively, let the application auto-create on first run
cd ../Hms.Api
dotnet run
```

#### 4. Run Backend
```bash
cd backend/Hms.Api
dotnet run

# API will be available at: http://localhost:5000
# Swagger documentation: http://localhost:5000/swagger
```

### Frontend Setup

#### 1. Install Dependencies
```bash
cd frontend
npm install
```

#### 2. Configure Environment

**src/environments/environment.ts:**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

#### 3. Run Frontend
```bash
cd frontend
npm start

# Application will be available at: http://localhost:4200
```

### Verification

1. **Backend Health Check**: Visit `http://localhost:5000/swagger`
2. **Frontend Access**: Visit `http://localhost:4200`
3. **Login Test**: Use credentials `admin` / `Passw0rd!`

## Docker Deployment

### Backend Dockerfile

**backend/Dockerfile:**
```dockerfile
# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy project files
COPY ["Hms.Api/Hms.Api.csproj", "Hms.Api/"]
COPY ["Hms.Application/Hms.Application.csproj", "Hms.Application/"]
COPY ["Hms.Domain/Hms.Domain.csproj", "Hms.Domain/"]
COPY ["Hms.Infrastructure/Hms.Infrastructure.csproj", "Hms.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "Hms.Api/Hms.Api.csproj"

# Copy source code
COPY . .

# Build application
WORKDIR "/src/Hms.Api"
RUN dotnet build "Hms.Api.csproj" -c Release -o /app/build

# Publish stage
FROM build AS publish
RUN dotnet publish "Hms.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .

# Expose port
EXPOSE 80

# Set entry point
ENTRYPOINT ["dotnet", "Hms.Api.dll"]
```

### Frontend Dockerfile

**frontend/Dockerfile:**
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build --prod

# Production stage
FROM nginx:alpine AS final
COPY --from=build /app/dist/hms-frontend /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  database:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong@Passw0rd
      - MSSQL_PID=Express
    ports:
      - "1433:1433"
    volumes:
      - sqlserver_data:/var/opt/mssql

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=database;Database=HmsDb;User Id=sa;Password=YourStrong@Passw0rd;TrustServerCertificate=true;
    ports:
      - "5000:80"
    depends_on:
      - database

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "4200:80"
    depends_on:
      - backend

volumes:
  sqlserver_data:
```

### Running with Docker

```bash
# Build and run all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (careful - this deletes data)
docker-compose down -v
```

## Production Deployment

### Azure Deployment

#### 1. Azure App Service (Backend)

**Create App Service:**
```bash
# Install Azure CLI
az login

# Create resource group
az group create --name HMS-RG --location "East US"

# Create App Service plan
az appservice plan create --name HMS-Plan --resource-group HMS-RG --sku B1

# Create web app
az webapp create --name hms-api --resource-group HMS-RG --plan HMS-Plan --runtime "DOTNETCORE|8.0"
```

**Deploy Backend:**
```bash
# Build for production
cd backend/Hms.Api
dotnet publish -c Release -o ./publish

# Deploy to Azure
az webapp deployment source config-zip --resource-group HMS-RG --name hms-api --src ./publish.zip
```

**Configure App Settings:**
```bash
az webapp config appsettings set --resource-group HMS-RG --name hms-api --settings \
  "ConnectionStrings__DefaultConnection=Server=your-sql-server;Database=HmsDb;User Id=username;Password=password;" \
  "Jwt__Key=your-production-jwt-key" \
  "Jwt__Issuer=HmsApi" \
  "Jwt__Audience=HmsClient"
```

#### 2. Azure SQL Database

**Create SQL Database:**
```bash
# Create SQL server
az sql server create --name hms-sql-server --resource-group HMS-RG --location "East US" --admin-user sqladmin --admin-password YourPassword123!

# Create database
az sql db create --resource-group HMS-RG --server hms-sql-server --name HmsDb --service-objective Basic

# Configure firewall
az sql server firewall-rule create --resource-group HMS-RG --server hms-sql-server --name AllowAzureServices --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
```

#### 3. Azure Static Web Apps (Frontend)

**Deploy Frontend:**
```bash
# Build for production
cd frontend
npm run build --prod

# Deploy to Azure Static Web Apps (via GitHub Actions or Azure CLI)
az staticwebapp create --name hms-frontend --resource-group HMS-RG --source https://github.com/your-repo --branch main --app-location "frontend" --output-location "dist"
```

### IIS Deployment (Windows Server)

#### 1. Prepare Server

**Install Prerequisites:**
```powershell
# Install IIS with ASP.NET Core module
Enable-WindowsOptionalFeature -Online -FeatureName IIS-WebServerRole, IIS-WebServer, IIS-CommonHttpFeatures, IIS-HttpErrors, IIS-HttpRedirect, IIS-ApplicationDevelopment, IIS-NetFxExtensibility45, IIS-HealthAndDiagnostics, IIS-HttpLogging, IIS-Security, IIS-RequestFiltering, IIS-Performance, IIS-WebServerManagementTools, IIS-ManagementConsole, IIS-IIS6ManagementCompatibility, IIS-Metabase, IIS-ASPNET45

# Install .NET 8 Hosting Bundle
# Download from Microsoft and install
```

#### 2. Deploy Backend

**Publish Application:**
```bash
cd backend/Hms.Api
dotnet publish -c Release -o C:\inetpub\wwwroot\hms-api
```

**Configure IIS:**
```xml
<!-- web.config in published folder -->
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <location path="." inheritInChildApplications="false">
    <system.webServer>
      <handlers>
        <add name="aspNetCore" path="*" verb="*" modules="AspNetCoreModuleV2" resourceType="Unspecified" />
      </handlers>
      <aspNetCore processPath="dotnet" arguments=".\Hms.Api.dll" stdoutLogEnabled="false" stdoutLogFile=".\logs\stdout" hostingModel="inprocess" />
    </system.webServer>
  </location>
</configuration>
```

#### 3. Deploy Frontend

**Build and Deploy:**
```bash
cd frontend
npm run build --prod

# Copy dist folder to IIS
xcopy /E /I dist\hms-frontend C:\inetpub\wwwroot\hms-frontend
```

**Configure IIS for Angular:**
```xml
<!-- web.config in frontend folder -->
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="Angular Routes" stopProcessing="true">
          <match url=".*" />
          <conditions logicalGrouping="MatchAll">
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
            <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
          </conditions>
          <action type="Rewrite" url="/index.html" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### Linux Deployment (Ubuntu)

#### 1. Prepare Server

**Install Prerequisites:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install .NET 8
wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt update
sudo apt install -y dotnet-runtime-8.0

# Install Nginx
sudo apt install -y nginx

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

#### 2. Deploy Backend

**Copy Application:**
```bash
# Publish locally and copy to server
cd backend/Hms.Api
dotnet publish -c Release -o ./publish

# Copy to server (using scp or rsync)
scp -r ./publish user@server:/var/www/hms-api
```

**Create Systemd Service:**
```ini
# /etc/systemd/system/hms-api.service
[Unit]
Description=HMS API
After=network.target

[Service]
Type=notify
ExecStart=/usr/bin/dotnet /var/www/hms-api/Hms.Api.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=hms-api
User=www-data
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
```

**Start Service:**
```bash
sudo systemctl enable hms-api
sudo systemctl start hms-api
sudo systemctl status hms-api
```

#### 3. Configure Nginx

**Backend Proxy:**
```nginx
# /etc/nginx/sites-available/hms-api
server {
    listen 80;
    server_name api.yourdomain.com;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection keep-alive;
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Frontend Hosting:**
```nginx
# /etc/nginx/sites-available/hms-frontend
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/hms-frontend;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://api.yourdomain.com/;
    }
}
```

**Enable Sites:**
```bash
sudo ln -s /etc/nginx/sites-available/hms-api /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/hms-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Environment Configuration

### Production Environment Variables

**Backend (.NET):**
```bash
ASPNETCORE_ENVIRONMENT=Production
ConnectionStrings__DefaultConnection=Server=prod-server;Database=HmsDb;User Id=username;Password=password;
Jwt__Key=your-production-jwt-key-256-bits-minimum
Jwt__Issuer=HmsApi
Jwt__Audience=HmsClient
```

**Frontend (Angular):**
```typescript
// src/environments/environment.prod.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com/api'
};
```

### SSL/HTTPS Configuration

#### 1. Obtain SSL Certificate

**Using Let's Encrypt (Linux):**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

**Using Azure (Azure App Service):**
```bash
# Enable HTTPS in Azure portal or CLI
az webapp config ssl bind --certificate-thumbprint <thumbprint> --ssl-type SNI --resource-group HMS-RG --name hms-api
```

#### 2. Update Nginx for HTTPS

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;
    
    # Rest of configuration...
}
```

## Database Migration in Production

### Automated Migration on Startup

```csharp
// Program.cs - for automated migrations (not recommended for production)
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    if (app.Environment.IsProduction())
    {
        // Use with caution in production
        await db.Database.MigrateAsync();
    }
    else
    {
        await db.Database.EnsureCreatedAsync();
    }
    await SeedData.SeedAsync(scope.ServiceProvider);
}
```

### Manual Migration (Recommended)

```bash
# Generate SQL script
dotnet ef migrations script --project Hms.Infrastructure --startup-project Hms.Api --output migration.sql

# Review and execute script manually in production database
sqlcmd -S server -d HmsDb -i migration.sql
```

## Monitoring and Logging

### Application Insights (Azure)

```csharp
// Program.cs
builder.Services.AddApplicationInsightsTelemetry();
```

```json
// appsettings.Production.json
{
  "ApplicationInsights": {
    "ConnectionString": "InstrumentationKey=your-key"
  }
}
```

### Structured Logging

```json
// appsettings.Production.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft": "Warning",
      "Microsoft.Hosting.Lifetime": "Information"
    }
  },
  "Serilog": {
    "Using": ["Serilog.Sinks.File"],
    "MinimumLevel": "Information",
    "WriteTo": [
      {
        "Name": "File",
        "Args": {
          "path": "/var/log/hms/hms-.log",
          "rollingInterval": "Day"
        }
      }
    ]
  }
}
```

## Security Considerations

### Production Security Checklist

- [ ] Use HTTPS everywhere
- [ ] Secure database connection strings
- [ ] Use strong JWT keys (256-bit minimum)
- [ ] Implement rate limiting
- [ ] Configure CORS properly
- [ ] Use secure headers
- [ ] Regular security updates
- [ ] Database backup strategy
- [ ] Implement audit logging

### Security Headers

```csharp
// Program.cs
app.Use(async (context, next) =>
{
    context.Response.Headers.Add("X-Frame-Options", "DENY");
    context.Response.Headers.Add("X-Content-Type-Options", "nosniff");
    context.Response.Headers.Add("X-XSS-Protection", "1; mode=block");
    context.Response.Headers.Add("Strict-Transport-Security", "max-age=31536000");
    await next();
});
```

## Backup and Recovery

### Database Backup Strategy

```sql
-- Automated backup script
BACKUP DATABASE HmsDb 
TO DISK = 'C:\Backups\HmsDb_Full.bak'
WITH FORMAT, INIT, COMPRESSION;

-- Schedule using SQL Server Agent or cron job
```

### Application Backup

```bash
# Backup application files
tar -czf hms-backup-$(date +%Y%m%d).tar.gz /var/www/hms-api /var/www/hms-frontend

# Backup configuration
cp /etc/nginx/sites-available/hms-* /backup/nginx/
cp /etc/systemd/system/hms-api.service /backup/systemd/
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Issues
```bash
# Check connection string
# Verify SQL Server is running
# Check firewall rules
# Verify credentials
```

#### 2. CORS Issues
```bash
# Verify CORS policy in Program.cs
# Check frontend API URL configuration
# Verify preflight OPTIONS requests
```

#### 3. SSL Certificate Issues
```bash
# Verify certificate installation
# Check certificate expiration
# Verify certificate chain
```

### Log Analysis

```bash
# View application logs (Linux)
sudo journalctl -u hms-api -f

# View Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# View application logs (Windows)
# Check Event Viewer > Windows Logs > Application
```

## Performance Optimization

### Production Optimizations

1. **Enable Response Compression**
2. **Use CDN for static assets**
3. **Implement caching strategies**
4. **Optimize database queries**
5. **Enable output caching**
6. **Use connection pooling**

### Monitoring Metrics

- Response time
- Request rate
- Error rate
- Database performance
- Memory usage
- CPU utilization
