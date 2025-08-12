# Contributing to Hospital Management System (HMS)

Thank you for your interest in contributing to the Hospital Management System! This document provides guidelines and information for contributors.

## Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Setup](#development-setup)
4. [Contributing Process](#contributing-process)
5. [Coding Standards](#coding-standards)
6. [Testing Requirements](#testing-requirements)
7. [Pull Request Guidelines](#pull-request-guidelines)
8. [Issue Reporting](#issue-reporting)
9. [Community Guidelines](#community-guidelines)

## Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- The use of sexualized language or imagery
- Personal attacks or insulting/derogatory comments
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Project maintainers are responsible for clarifying standards and will take appropriate action in response to any instances of unacceptable behavior.

## Getting Started

### Prerequisites

Before contributing, ensure you have:
- **Git** installed and configured
- **.NET 8 SDK** installed
- **Node.js 18+** and npm installed
- **Angular CLI 20** installed
- **SQL Server Express** or compatible database
- Basic knowledge of C#, TypeScript, and Angular

### First-Time Contributors

If you're new to open source contribution:
1. **Read the documentation** thoroughly
2. **Browse existing issues** to understand the project
3. **Start with beginner-friendly issues** labeled `good first issue`
4. **Ask questions** in discussions or issues if you need help

## Development Setup

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/your-username/HMS.git
cd HMS

# Add upstream remote
git remote add upstream https://github.com/original-owner/HMS.git
```

### 2. Environment Setup

```bash
# Backend setup
cd backend
dotnet restore
dotnet build

# Frontend setup
cd ../frontend
npm install

# Database setup
cd ../backend/Hms.Infrastructure
dotnet ef database update --startup-project ../Hms.Api
```

### 3. Verify Setup

```bash
# Start backend (from backend/Hms.Api)
dotnet run

# Start frontend (from frontend)
npm start

# Verify both are running:
# Backend: http://localhost:5000
# Frontend: http://localhost:4200
```

## Contributing Process

### 1. Choose What to Work On

#### Finding Issues
- Browse the [Issues](https://github.com/project/issues) page
- Look for issues labeled:
  - `good first issue` - Perfect for new contributors
  - `help wanted` - Community assistance needed
  - `bug` - Bug fixes needed
  - `enhancement` - New features
  - `documentation` - Documentation improvements

#### Creating New Issues
Before starting new work, create an issue to discuss:
- **Bug reports** with reproduction steps
- **Feature requests** with detailed descriptions
- **Documentation improvements** with specific areas

### 2. Create a Working Branch

```bash
# Sync your fork with upstream
git checkout main
git pull upstream main
git push origin main

# Create a feature branch
git checkout -b feature/descriptive-name
# or
git checkout -b bugfix/issue-description
```

### 3. Development Workflow

#### Branch Naming Conventions
- **Features**: `feature/patient-search-functionality`
- **Bug fixes**: `bugfix/appointment-validation-error`
- **Documentation**: `docs/update-api-documentation`
- **Refactoring**: `refactor/simplify-service-layer`
- **Performance**: `perf/optimize-database-queries`

#### Commit Message Format

```
type(scope): brief description

Detailed explanation of the changes made and why.
Include any breaking changes or notable implementation details.

Resolves #123
Closes #456
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**
```
feat(patients): add advanced search functionality

- Implement search by multiple criteria
- Add date range filtering
- Include pagination for large result sets
- Add export functionality

Resolves #123

fix(appointments): resolve timezone handling bug

The appointment scheduling was not properly handling
timezone conversions, causing appointments to appear
at incorrect times in different timezones.

Fixes #456

docs(api): update patient endpoints documentation

- Add missing request/response examples
- Document new query parameters
- Update error response codes
- Add rate limiting information
```

### 4. Make Your Changes

#### Code Organization
- Follow the existing project structure
- Create new files in appropriate directories
- Update related documentation
- Add appropriate tests

#### Backend Changes
```csharp
// Example: Adding a new service method
public async Task<List<PatientDto>> SearchPatientsAdvancedAsync(PatientSearchCriteria criteria)
{
    // Implementation with proper error handling
    try
    {
        var patients = await _repository.SearchAdvancedAsync(criteria);
        return patients.Select(_mapper.Map<PatientDto>).ToList();
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error during advanced patient search");
        throw;
    }
}
```

#### Frontend Changes
```typescript
// Example: Adding a new component method
searchPatients(criteria: PatientSearchCriteria): void {
  this.loading = true;
  this.patientService.searchAdvanced(criteria)
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => this.loading = false)
    )
    .subscribe({
      next: (patients) => {
        this.patients = patients;
        this.snackBar.open('Search completed successfully', 'Close');
      },
      error: (error) => {
        console.error('Search failed:', error);
        this.snackBar.open('Search failed. Please try again.', 'Close');
      }
    });
}
```

## Coding Standards

### Backend Standards (.NET/C#)

#### Naming Conventions
- **Classes**: PascalCase (`PatientService`)
- **Methods**: PascalCase (`GetPatientAsync`)
- **Properties**: PascalCase (`FullName`)
- **Fields**: camelCase with underscore (`_repository`)
- **Interfaces**: PascalCase with 'I' prefix (`IPatientService`)

#### Code Style
```csharp
// Good: Proper async/await usage
public async Task<Patient?> GetPatientAsync(Guid id)
{
    if (id == Guid.Empty)
        throw new ArgumentException("Patient ID cannot be empty", nameof(id));
        
    return await _context.Patients
        .Include(p => p.MedicalRecords)
        .FirstOrDefaultAsync(p => p.Id == id);
}

// Good: Proper error handling
public async Task<PatientDto> CreatePatientAsync(CreatePatientDto dto)
{
    try
    {
        var patient = _mapper.Map<Patient>(dto);
        patient = await _repository.AddAsync(patient);
        
        _logger.LogInformation("Created patient with ID {PatientId}", patient.Id);
        return _mapper.Map<PatientDto>(patient);
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Failed to create patient");
        throw;
    }
}
```

### Frontend Standards (Angular/TypeScript)

#### Naming Conventions
- **Components**: PascalCase (`PatientListComponent`)
- **Services**: PascalCase (`PatientService`)
- **Methods**: camelCase (`loadPatients`)
- **Properties**: camelCase (`selectedPatient`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS`)

#### Code Style
```typescript
// Good: Proper component structure
@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.scss']
})
export class PatientListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  patients: Patient[] = [];
  loading = false;

  constructor(private patientService: PatientService) {}

  ngOnInit(): void {
    this.loadPatients();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadPatients(): void {
    this.loading = true;
    this.patientService.getAll()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (patients) => this.patients = patients,
        error: (error) => console.error('Failed to load patients:', error)
      });
  }
}
```

#### Angular Best Practices
- Use standalone components
- Implement OnDestroy for subscription cleanup
- Use reactive forms for complex forms
- Follow Angular style guide
- Use TypeScript strict mode

### General Standards

#### File Organization
```
feature/
├── feature.component.ts
├── feature.component.html
├── feature.component.scss
├── feature.component.spec.ts
├── feature.service.ts
├── feature.service.spec.ts
└── feature.models.ts
```

#### Documentation
```csharp
/// <summary>
/// Retrieves a patient by their unique identifier
/// </summary>
/// <param name="id">The unique patient identifier</param>
/// <returns>The patient if found, null otherwise</returns>
/// <exception cref="ArgumentException">Thrown when id is empty</exception>
public async Task<Patient?> GetPatientAsync(Guid id)
```

```typescript
/**
 * Loads all patients from the server
 * @returns Observable containing array of patients
 * @throws {HttpErrorResponse} When server request fails
 */
loadPatients(): Observable<Patient[]> {
  return this.http.get<Patient[]>(`${this.apiUrl}/patients`);
}
```

## Testing Requirements

### Backend Testing

#### Unit Tests Required
- All service methods
- Repository implementations
- Custom validators
- Utility classes

#### Example Unit Test
```csharp
[Fact]
public async Task GetPatientAsync_ValidId_ReturnsPatient()
{
    // Arrange
    var patientId = Guid.NewGuid();
    var expectedPatient = new Patient { Id = patientId, FullName = "Test Patient" };
    
    _mockRepository.Setup(r => r.GetByIdAsync(patientId))
                   .ReturnsAsync(expectedPatient);

    // Act
    var result = await _service.GetPatientAsync(patientId);

    // Assert
    Assert.NotNull(result);
    Assert.Equal(patientId, result.Id);
    Assert.Equal("Test Patient", result.FullName);
}
```

#### Integration Tests
- Controller endpoints
- Database operations
- Authentication flows

### Frontend Testing

#### Unit Tests Required
- Component logic
- Service methods
- Pipes and utilities
- Guards and interceptors

#### Example Component Test
```typescript
it('should load patients on init', () => {
  const mockPatients: Patient[] = [
    { id: '1', fullName: 'Patient 1', dateOfBirth: new Date(), gender: 'Male', contact: '123', address: 'Address 1' }
  ];

  patientService.getAll.and.returnValue(of(mockPatients));

  component.ngOnInit();

  expect(patientService.getAll).toHaveBeenCalled();
  expect(component.patients).toEqual(mockPatients);
});
```

### Test Coverage Requirements
- **Backend**: Minimum 80% code coverage
- **Frontend**: Minimum 70% code coverage
- **Critical paths**: 95% coverage required

### Running Tests
```bash
# Backend tests
cd backend
dotnet test

# Frontend tests
cd frontend
npm test

# Coverage reports
npm run test:coverage
```

## Pull Request Guidelines

### Before Submitting

#### Checklist
- [ ] Code follows project standards
- [ ] All tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated if needed
- [ ] No console.log or debugger statements
- [ ] No commented-out code
- [ ] Commit messages follow format
- [ ] Branch is up to date with main

#### Self-Review
1. **Review your own code** first
2. **Check for typos** and formatting issues
3. **Verify functionality** works as expected
4. **Test edge cases** and error conditions
5. **Ensure performance** is acceptable

### Pull Request Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] All tests pass

## Screenshots (if applicable)
Add screenshots for UI changes.

## Related Issues
Closes #123
Resolves #456
```

### Review Process

#### What Reviewers Look For
- **Code quality**: Clean, readable, maintainable
- **Functionality**: Works as intended
- **Performance**: No significant performance degradation
- **Security**: No security vulnerabilities introduced
- **Testing**: Adequate test coverage
- **Documentation**: Updated where necessary

#### Addressing Feedback
1. **Read feedback carefully**
2. **Ask questions** if unclear
3. **Make requested changes**
4. **Respond to comments** when done
5. **Request re-review** when ready

## Issue Reporting

### Bug Reports

#### Information to Include
- **Environment**: OS, browser, .NET version
- **Steps to reproduce**: Clear, numbered steps
- **Expected behavior**: What should happen
- **Actual behavior**: What actually happened
- **Screenshots**: If applicable
- **Error messages**: Full error text
- **Browser console**: Any JavaScript errors

#### Bug Report Template
```markdown
**Environment:**
- OS: Windows 11
- Browser: Chrome 120.0
- .NET Version: 8.0
- Node Version: 18.17.0

**Bug Description:**
A clear description of what the bug is.

**Steps to Reproduce:**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
A clear description of what you expected to happen.

**Actual Behavior:**
A clear description of what actually happened.

**Screenshots:**
If applicable, add screenshots to help explain your problem.

**Additional Context:**
Add any other context about the problem here.
```

### Feature Requests

#### Information to Include
- **Problem statement**: What problem does this solve?
- **Proposed solution**: Detailed description of the feature
- **User stories**: How would users interact with this?
- **Alternatives considered**: Other ways to solve the problem
- **Additional context**: Screenshots, mockups, etc.

## Community Guidelines

### Communication

#### Channels
- **GitHub Issues**: Bug reports, feature requests
- **GitHub Discussions**: General questions, ideas
- **Pull Request Comments**: Code-specific discussions
- **Email**: Private security concerns

#### Guidelines
- **Be respectful** and professional
- **Search existing issues** before creating new ones
- **Provide detailed information** in reports
- **Follow up** on your issues and PRs
- **Help others** when you can

### Recognition

We recognize contributors through:
- **Contributor list** in the README
- **Release notes** mentions
- **Special contributor badges**
- **Annual contributor awards**

### Getting Help

#### For New Contributors
- Check the [Developer Guide](DEVELOPER_GUIDE.md)
- Read existing code and documentation
- Ask questions in GitHub Discussions
- Start with small, well-defined issues

#### For Complex Issues
- Create a detailed issue description
- Provide minimal reproduction cases
- Include relevant logs and error messages
- Be patient - complex issues take time

### Mentorship

We welcome mentoring new contributors:
- **Pair programming** sessions available
- **Code review** feedback and guidance
- **Architecture** discussions and explanations
- **Best practices** sharing and learning

## License

By contributing to this project, you agree that your contributions will be licensed under the same license as the project (MIT License).

## Questions?

If you have questions about contributing, please:
1. Check this document first
2. Search existing issues and discussions
3. Create a new discussion for general questions
4. Create an issue for specific problems

Thank you for contributing to the Hospital Management System! 🏥✨
