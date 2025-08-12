# User Guide - Hospital Management System (HMS)

## Table of Contents
1. [Getting Started](#getting-started)
2. [User Roles and Permissions](#user-roles-and-permissions)
3. [Dashboard Overview](#dashboard-overview)
4. [Patient Management](#patient-management)
5. [Appointment Scheduling](#appointment-scheduling)
6. [Medical Records](#medical-records)
7. [Document Management](#document-management)
8. [Staff Management](#staff-management)
9. [System Features](#system-features)
10. [Troubleshooting](#troubleshooting)

## Getting Started

### Accessing the System

1. **Open your web browser** and navigate to the HMS application URL
   - Development: `http://localhost:4200`
   - Production: Your organization's HMS URL

2. **Login Screen**: You'll be presented with a secure login interface

### Default User Accounts

For initial setup and testing, the following accounts are available:

| Role | Username | Password | Description |
|------|----------|----------|-------------|
| Admin | admin | Passw0rd! | Full system access |
| Doctor | drsmith | Passw0rd! | Medical professional access |
| Nurse | nurseamy | Passw0rd! | Nursing staff access |
| Receptionist | reception1 | Passw0rd! | Front desk operations |

> **Security Note**: Change these default passwords immediately after first login in production environments.

### First-Time Login

1. Enter your **username** and **password**
2. Click **"Login"** button
3. The system will redirect you to the appropriate dashboard based on your role
4. For first-time users, consider updating your profile information

## User Roles and Permissions

### Admin Role
**Full system access including:**
- Complete patient management
- Staff account creation and management
- System configuration
- All reporting and analytics
- User role assignments

### Doctor Role
**Medical professional access:**
- Patient medical records (read/write)
- Appointment management
- Prescription management
- Document access
- Treatment plan creation

### Nurse Role
**Nursing staff access:**
- Patient information (read/limited write)
- Appointment viewing
- Medical record viewing
- Document access
- Basic patient care updates

### Receptionist Role
**Front desk operations:**
- Patient registration
- Appointment scheduling
- Basic patient information updates
- Document upload assistance
- Visitor management

### Patient Role
**Personal health record access:**
- Own medical records (read-only)
- Personal appointments
- Document viewing
- Profile updates

## Dashboard Overview

The dashboard provides a comprehensive overview of hospital operations with role-specific information.

### Dashboard Components

#### Summary Statistics Cards
- **Total Patients**: Current patient count in the system
- **Today's Appointments**: Number of appointments scheduled for today
- **Active Doctors**: Number of doctors currently in the system
- **Monthly Revenue**: Financial overview (Admin only)

#### Charts and Analytics
- **Patient Visits by Month**: Visual representation of patient flow
- **Department Distribution**: Breakdown of patients by medical specialty
- **Recent Activity**: Real-time feed of system activities

#### Quick Actions
- **Search Patients**: Quick patient lookup
- **View Schedule**: Today's appointment calendar
- **Medical Records**: Access patient records
- **Manage Staff**: User administration (Admin only)

### Navigation Menu

The main navigation provides access to all system features:
- **Dashboard**: System overview and statistics
- **Patients**: Patient management functions
- **Appointments**: Scheduling and calendar management
- **Records**: Medical records and history
- **Staff**: User and staff management
- **Documents**: File and document management

## Patient Management

### Patient Registration

#### Adding a New Patient

1. **Navigate** to "Patients" → "Add New Patient"
2. **Fill in required information:**
   - Full Name (required)
   - Date of Birth (required)
   - Gender (required)
   - Contact Number (required)
   - Address (required)
3. **Optional information:**
   - Emergency contact
   - Insurance details
   - Medical alerts
4. **Click "Save"** to create the patient record

#### Required Fields
- **Full Name**: Patient's complete legal name
- **Date of Birth**: Used for age calculations and verification
- **Gender**: Medical relevance for treatments
- **Contact**: Primary phone number
- **Address**: Current residential address

### Patient Search and Management

#### Search Functionality
- **Search by Name**: Type patient's name in the search bar
- **Search by ID**: Use the unique patient identifier
- **Search by Phone**: Enter contact number
- **Advanced Filters**: Filter by age, gender, or registration date

#### Patient Profile Management

1. **View Patient Details**: Click on any patient in the list
2. **Edit Information**: Click the "Edit" button to modify details
3. **Patient History**: View complete medical timeline
4. **Related Records**: Access appointments, medical records, and documents

### Patient List Features

#### Table Columns
- **Patient ID**: Unique system identifier
- **Name and Avatar**: Visual patient identification
- **Contact Information**: Phone number display
- **Age Calculation**: Automatic age calculation from date of birth
- **Quick Actions**: Edit, view, or manage patient options

#### Bulk Operations
- **Export Patient Data**: Download patient lists as CSV/Excel
- **Print Patient Lists**: Generate printable reports
- **Bulk Communications**: Send notifications to multiple patients

## Appointment Scheduling

### Creating Appointments

#### Booking Process

1. **Access Scheduling**: Navigate to "Appointments" → "New Appointment"
2. **Select Patient**: Choose from existing patients or register new patient
3. **Choose Doctor**: Select available medical professional
4. **Set Date and Time**: Use the calendar interface
5. **Appointment Details**:
   - Duration (default 30 minutes)
   - Reason for visit
   - Priority level
   - Special instructions
6. **Confirm Booking**: Review details and save

#### Appointment Types
- **Regular Checkup**: Routine medical examination
- **Follow-up**: Post-treatment consultation
- **Emergency**: Urgent medical care
- **Consultation**: Specialist advice
- **Procedure**: Medical procedure or surgery

### Calendar Views

#### List View
- **Today's Schedule**: All appointments for current date
- **Chronological Order**: Appointments sorted by time
- **Status Indicators**: Visual status representation
- **Quick Actions**: Reschedule, cancel, or complete appointments

#### Calendar View
- **Monthly Overview**: Visual calendar with appointment indicators
- **Time Slot Management**: Hour-by-hour scheduling
- **Color Coding**: Different colors for appointment types
- **Drag-and-Drop**: Easy rescheduling interface

### Appointment Management

#### Status Management
- **Scheduled**: Initial booking status
- **Confirmed**: Patient confirmation received
- **In Progress**: Appointment currently active
- **Completed**: Finished appointment
- **Cancelled**: Cancelled by patient or staff
- **No Show**: Patient did not attend

#### Rescheduling
1. **Select Appointment**: Click on the appointment to modify
2. **Choose New Time**: Select available time slot
3. **Update Details**: Modify duration or notes if needed
4. **Notify Patient**: Send automatic rescheduling notification
5. **Confirm Changes**: Save the updated appointment

## Medical Records

### Creating Medical Records

#### New Medical Record Entry

1. **Select Patient**: Choose patient from the list
2. **Record Details**:
   - **Visit Date**: Date of medical consultation
   - **Diagnosis**: Medical diagnosis or findings
   - **Prescription**: Medications prescribed
   - **Treatment Plan**: Recommended treatment course
   - **Notes**: Additional observations
3. **Doctor Information**: Automatically captures logged-in doctor
4. **Save Record**: Store in patient's medical history

#### Medical Record Components

**Primary Information:**
- Patient identification
- Date and time of visit
- Attending physician
- Chief complaint

**Clinical Data:**
- Physical examination findings
- Diagnostic test results
- Vital signs
- Symptoms assessment

**Treatment Information:**
- Diagnosis codes (ICD-10)
- Prescribed medications
- Dosage instructions
- Treatment recommendations

### Medical History Management

#### Viewing Patient History
- **Chronological Timeline**: Records sorted by date
- **Filter by Doctor**: View records by specific physician
- **Filter by Date Range**: Historical data analysis
- **Search by Diagnosis**: Find specific medical conditions

#### Record Updates
- **Edit Recent Records**: Modify recent entries (24-hour window)
- **Add Amendments**: Append additional information
- **Correction Notes**: Document any corrections made
- **Audit Trail**: Track all changes for compliance

### Prescription Management

#### Electronic Prescriptions
- **Medication Database**: Select from comprehensive drug database
- **Dosage Calculations**: Automatic dosage recommendations
- **Drug Interactions**: Automatic interaction checking
- **Allergy Alerts**: Patient allergy warnings

#### Prescription History
- **Current Medications**: Active prescriptions
- **Medication History**: Previously prescribed drugs
- **Refill Management**: Track prescription refills
- **Compliance Monitoring**: Patient adherence tracking

## Document Management

### Document Upload

#### Supported File Types
- **PDF Documents**: Medical reports, lab results
- **Images**: X-rays, scans, photographs
- **Office Documents**: Word, Excel files
- **DICOM Files**: Medical imaging standards

#### Upload Process

1. **Select Patient**: Choose patient for document association
2. **Drag and Drop**: Use intuitive file upload interface
3. **File Information**:
   - Document title
   - Document type/category
   - Upload date (automatic)
   - File size and format
4. **Save Document**: Store in patient's file

### Document Organization

#### Categories
- **Lab Results**: Blood tests, urine tests, biopsies
- **Imaging**: X-rays, MRI, CT scans, ultrasounds
- **Reports**: Specialist reports, discharge summaries
- **Insurance**: Insurance cards, authorization forms
- **Legal**: Consent forms, advance directives

#### Document Management Features
- **Version Control**: Track document versions
- **Access Permissions**: Control who can view documents
- **Download Options**: PDF export and printing
- **Sharing**: Secure document sharing with other providers

### Document Security

#### Privacy Protection
- **Encrypted Storage**: All documents encrypted at rest
- **Access Logging**: Track who accessed which documents
- **Role-Based Access**: Permissions based on user roles
- **HIPAA Compliance**: Meeting healthcare privacy requirements

## Staff Management

### User Account Management

#### Creating Staff Accounts

1. **Admin Access Required**: Only administrators can create accounts
2. **Staff Information**:
   - Username (unique)
   - Email address
   - Full name
   - Role assignment
   - Initial password
3. **Role Selection**: Choose appropriate access level
4. **Account Activation**: Account immediately active upon creation

#### User Roles Configuration
- **Role Assignment**: Select single or multiple roles
- **Permission Inheritance**: Automatic permission assignment
- **Role Modifications**: Update roles as needed
- **Temporary Access**: Create time-limited accounts

### Staff Directory

#### Staff Information Display
- **Full Name**: Complete staff member name
- **Username**: System login identifier
- **Email**: Contact email address
- **Roles**: Assigned system roles
- **Status**: Active/inactive account status

#### Staff Management Functions
- **Edit Profiles**: Update staff information
- **Reset Passwords**: Administrative password reset
- **Deactivate Accounts**: Disable access without deletion
- **Role Changes**: Modify access permissions

## System Features

### Search and Filtering

#### Global Search
- **Universal Search Bar**: Search across all modules
- **Auto-complete**: Intelligent search suggestions
- **Recent Searches**: Quick access to previous searches
- **Advanced Filters**: Multi-criteria search options

#### Module-Specific Filters
- **Patient Filters**: Age, gender, registration date
- **Appointment Filters**: Date range, doctor, status
- **Record Filters**: Diagnosis, date, doctor
- **Document Filters**: Type, date, size

### Data Export and Reporting

#### Export Options
- **CSV Format**: Spreadsheet-compatible data
- **PDF Reports**: Formatted documents
- **Excel Files**: Advanced spreadsheet features
- **Print Options**: Direct printing support

#### Report Types
- **Patient Reports**: Demographics, medical summaries
- **Appointment Reports**: Scheduling analytics
- **Financial Reports**: Revenue and billing (Admin only)
- **Activity Reports**: System usage statistics

### Responsive Design

#### Multi-Device Support
- **Desktop Computers**: Full feature access
- **Tablets**: Touch-optimized interface
- **Mobile Phones**: Essential features available
- **Cross-Browser**: Chrome, Firefox, Safari, Edge

#### Accessibility Features
- **Screen Reader Support**: WCAG 2.1 compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Visual accessibility options
- **Font Scaling**: Adjustable text sizes

## System Notifications

### Real-Time Notifications
- **Appointment Reminders**: Upcoming appointment alerts
- **System Updates**: Important system announcements
- **Security Alerts**: Login and security notifications
- **Task Reminders**: Follow-up and task notifications

### Communication Features
- **Internal Messaging**: Staff-to-staff communication
- **Patient Notifications**: Appointment confirmations
- **Email Integration**: Automated email notifications
- **SMS Alerts**: Text message notifications (if configured)

## Data Backup and Security

### Automatic Backups
- **Daily Backups**: Automatic daily data backup
- **Version Control**: Multiple backup versions maintained
- **Recovery Options**: Point-in-time recovery available
- **Cloud Storage**: Secure cloud backup storage

### Security Features
- **Session Management**: Automatic session timeouts
- **Password Policies**: Strong password requirements
- **Two-Factor Authentication**: Enhanced login security (optional)
- **Audit Logging**: Complete activity tracking

## Troubleshooting

### Common Issues and Solutions

#### Login Problems
**Issue**: Cannot log in to the system
**Solutions**:
1. Verify username and password spelling
2. Check Caps Lock status
3. Clear browser cache and cookies
4. Try a different browser
5. Contact system administrator

#### Performance Issues
**Issue**: System running slowly
**Solutions**:
1. Check internet connection speed
2. Close unnecessary browser tabs
3. Clear browser cache
4. Restart browser
5. Contact IT support

#### Data Not Loading
**Issue**: Information not displaying
**Solutions**:
1. Refresh the page (F5 or Ctrl+R)
2. Check network connection
3. Log out and log back in
4. Try a different browser
5. Report to technical support

#### Print Problems
**Issue**: Cannot print reports or documents
**Solutions**:
1. Check printer connection
2. Verify printer driver installation
3. Try printing from a different browser
4. Use PDF export as alternative
5. Contact IT support

### Browser Compatibility

#### Recommended Browsers
- **Google Chrome**: Version 90+ (recommended)
- **Mozilla Firefox**: Version 88+
- **Microsoft Edge**: Version 90+
- **Safari**: Version 14+ (macOS only)

#### Browser Settings
- **JavaScript**: Must be enabled
- **Cookies**: Required for authentication
- **Pop-up Blocker**: May need to allow pop-ups for HMS domain
- **Cache**: Regular cache clearing recommended

### Getting Help

#### Support Resources
- **User Manual**: This comprehensive guide
- **System Administrator**: Contact your organization's admin
- **Technical Support**: IT helpdesk contact information
- **Training Videos**: Online tutorial resources

#### Reporting Issues
When reporting problems, include:
1. **Detailed Description**: What you were trying to do
2. **Error Messages**: Exact text of any error messages
3. **Browser Information**: Browser type and version
4. **Steps to Reproduce**: How to recreate the problem
5. **Screenshots**: Visual documentation if applicable

#### Contact Information
- **System Administrator**: [Your organization's admin contact]
- **Technical Support**: [Your IT support contact]
- **Emergency Contact**: [After-hours support contact]

---

**Last Updated**: [Current Date]
**Version**: 1.0
**Document Owner**: [Your Organization Name]
