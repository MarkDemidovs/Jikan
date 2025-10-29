# JIKAN ⏰

JIKAN is a collaborative event management system designed to help teams keep track of events and schedules across different time zones. Currently in development, with plans for a full production release.

## Features

- 🔐 User authentication and authorization
- 👥 Team management and collaboration
- 📅 Event scheduling and tracking
- 🌐 Multi-team support
- ⚡ Real-time event updates
- 🗑️ Automatic cleanup of past events

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- PostgreSQL (v13 or higher)
- npm (v6 or higher)

## Installation

### Database Setup
1. Install PostgreSQL if you haven't already
2. Run the setup script:
   ```sql
   psql -f jikanSetup.sql
   ```

### Backend Setup
1. Navigate to the project root:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file with your configuration:
   ```
   PORT=3001
   DB_PORT=5432
   DB_USER=your_username
   DB_HOST=localhost
   DB_NAME=jikan
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Development Roadmap

### Current Tasks
- [ ] Team exit functionality
- [ ] Enhanced UI/UX styling
- [ ] Extended time range support (from-to hours)
- [ ] Full table reset.

### Future Enhancements
- [ ] Time zone support
- [ ] Event notifications
- [ ] Mobile responsive design
- [ ] Team calendar view

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Notes

### Known Issues
1. Most code currently resides in a single file - needs refactoring
2. Missing proper component separation
3. Requires better state management implementation

## License

This project is licensed under the BSD-3-Clause License - see the LICENSE file for details.