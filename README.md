# Campus Hiring Evaluation - Roll Number: 2215045

A comprehensive HTTP URL Shortener Microservice with integrated Logging Middleware, built for Campus Hiring Backend Evaluation.



A simple and robust HTTP URL Shortener microservice with analytics capabilities, built with extensive logging integration.

## � API Output Examples

### Output-1: POST Request Response
**Request:** `POST http://localhost:3000/shorturls`
```json
{
    "url": "https://very-very-very-long-and-descriptive-subdomain-that-goes-on-and-on.somedomain.com/additional/directory/levels/for/more/length/really-log-sub-domain/a-really-log-page",
    "validity": 30,
    "shortcode": "abcd1"
}
```

**Response:**
![Output-1: POST Response](output-1.png)

*Expected Response (201 Created):*
```json
{
    "shortLink": "http://localhost:3000/abcd1",
    "expiry": "2025-08-20T08:00:00.000Z"
}
```

### Output-2: GET Request Response
**Request:** `GET http://localhost:3000/shorturls/abcd1`

**Response:**
![Output-2: GET Response](output-2.png)

*Expected Response (200 OK):*
```json
{
    "originalUrl": "https://very-very-very-long-and-descriptive-subdomain-that-goes-on-and-on.somedomain.com/additional/directory/levels/for/more/length/really-log-sub-domain/a-really-log-page",
    "shortcode": "abcd1",
    "createdAt": "2025-08-20T07:30:00.000Z",
    "expiresAt": "2025-08-20T08:00:00.000Z",
    "totalClicks": 0,
    "clickDetails": [],
    "isActive": true
}
```



## 🏗️ Project Structure

```
2215045/
├── package.json                    # Single package.json for entire project
├── node_modules/                   # Single node_modules folder
├── .gitignore                     # Git ignore file
├── README.md                      # This file
├── 
├── Backend Test Submission/       # URL Shortener Microservice
│   ├── server.js                  # Main Express server
│   ├── database.js                # In-memory URL storage
│   ├── utils.js                   # Helper functions
│   ├── README.md                  # Backend API documentation
│   ├── demo.js                    # API demonstration script
│   └── test.js                    # API test scripts
│
├── Logging Middleware/            # Logging Package
│   ├── index.js                   # Main logging middleware
│   ├── auth-manager.js            # Authentication handler
│   ├── setup.js                   # Credentials configuration
│   ├── demo.js                    # Logging demonstration
│   ├── test.js                    # Logging tests
│   └── README.md                  # Logging documentation
│
└── scripts/                       # Unified Scripts
    ├── start.js                   # Unified start script
    └── test-all.js                # Run all tests
```

## 🚀 Quick Start

### Installation
```bash
# Install all dependencies
npm install
```

### Run the Application
```bash
# Start the URL Shortener service
npm start

# Start in development mode with auto-reload
npm run dev
```

### Testing
```bash
# Run all tests
npm test

# Test individual components
npm run test:backend
npm run test:logging

# Run demos
npm run demo:backend
npm run demo:logging
```

## 🌐 API Endpoints

The URL Shortener runs on `http://localhost:3000`

- **POST /shorturls** - Create short URL
- **GET /shorturls/:shortcode** - Get URL statistics
- **GET /:shortcode** - Redirect to original URL
- **GET /health** - Health check

## 📊 Features

### URL Shortener Microservice
- ✅ Custom and auto-generated shortcodes
- ✅ Configurable validity periods (default: 30 minutes)
- ✅ Comprehensive analytics with click tracking
- ✅ Geolocation-based analytics
- ✅ Robust error handling

### Logging Middleware
- ✅ Automatic authentication with evaluation server
- ✅ Smart token refresh management
- ✅ Comprehensive logging across all operations
- ✅ Multiple log levels (info, warn, error, debug, fatal)
- ✅ Integrated with URL Shortener for complete observability

## 🔧 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Storage**: In-memory (Map-based)
- **Authentication**: JWT with automatic refresh
- **Logging**: Custom middleware integrated with evaluation server
- **Analytics**: IP-based geolocation, referrer tracking

## 📋 Campus Hiring Compliance

This project meets all requirements specified in the Campus Hiring Evaluation:
- ✅ Proper folder structure (`Backend Test Submission/`, `Logging Middleware/`)
- ✅ Comprehensive logging integration throughout the application
- ✅ RESTful API design with proper HTTP status codes
- ✅ Custom shortcode support with collision handling
- ✅ Analytics tracking with detailed click information
- ✅ Robust error handling and validation
- ✅ Complete documentation and testing

## 🏃‍♂️ Getting Started

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start the server**: `npm start`
4. **Test the API**: Visit `http://localhost:3000/health`
5. **Run demos**: `npm run demo:backend`

## 📚 Documentation

- [`Backend Test Submission/README.md`](Backend%20Test%20Submission/README.md) - Detailed API documentation
- [`Logging Middleware/README.md`](Logging%20Middleware/README.md) - Logging middleware documentation

## 🎯 Evaluation Ready

This project is complete and ready for Campus Hiring evaluation with:
- All functional requirements implemented
- Comprehensive logging integration
- Production-quality code standards
- Complete test coverage
- Thorough documentation

---

**Student Submission for Campus Hiring Backend Evaluation**  
**Roll Number**: 2215045  
**Date**: August 20, 2025
