# HT## 📸 API Output ExamplesP URL Shortener Microservice

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
![Output-1: POST Response](screenshots/output-1.png)

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
![Output-2: GET Response](screenshots/output-2.png)

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

---

## �🚀 Features

- ✅ **URL Shortening** - Convert long URLs to short, manageable links
- ✅ **Custom Shortcodes** - Use your own custom shortcodes or auto-generate unique ones
- ✅ **Expiry Management** - Set custom validity periods (default: 30 minutes)
- ✅ **Analytics Tracking** - Track clicks, referrers, and geographical data
- ✅ **Comprehensive Logging** - Integrated with evaluation server logging
- ✅ **Error Handling** - Robust error handling with proper HTTP status codes

## 📦 Installation & Setup

```bash
# Navigate to the project directory
cd "Backend Test Submission"

# Install dependencies
npm install

# Start the server
npm start

# For development with auto-restart
npm run dev
```

## 🌐 API Endpoints

### Create Short URL
**POST** `/shorturls`

Creates a new shortened URL with optional custom shortcode and validity period.

**Request Body:**
```json
{
    "url": "https://very-very-very-long-and-descriptive-subdomain-that-goes-on-and-on.somedomain.com/additional/directory/levels/for/more/length/really-log-sub-domain/a-really-log-page",
    "validity": 30,
    "shortcode": "abcd1"
}
```

**Parameters:**
- `url` (string, required) - The original long URL to be shortened
- `validity` (integer, optional) - Duration in minutes (default: 30)
- `shortcode` (string, optional) - Custom shortcode (3-20 alphanumeric characters)

**Response (201 Created):**
```json
{
    "shortLink": "http://localhost:3000/abcd1",
    "expiry": "2025-08-20T12:30:00Z"
}
```

### Get URL Statistics
**GET** `/shorturls/:shortcode`

Retrieves usage statistics and analytics for a specific shortened URL.

**Response (200 OK):**
```json
{
    "shortcode": "abcd1",
    "originalUrl": "https://example.com/very-long-url",
    "createdAt": "2025-08-20T12:00:00Z",
    "expiry": "2025-08-20T12:30:00Z",
    "totalClicks": 5,
    "isExpired": false,
    "clickDetails": [
        {
            "timestamp": "2025-08-20T12:05:00Z",
            "referrer": "google.com",
            "location": "New York, US"
        }
    ]
}
```

### Redirect to Original URL
**GET** `/:shortcode`

Redirects to the original URL and records analytics data.

**Response:** `302 Redirect` to the original URL

## 🔧 Configuration

The server runs on `http://localhost:3000` by default. You can configure:

- **PORT**: Set via environment variable (default: 3000)
- **HOST**: Set via environment variable (default: localhost)

## 📊 Analytics Data

Each click is tracked with:
- **Timestamp** - When the click occurred
- **Referrer** - Domain from which the user came
- **Location** - Coarse geographical location based on IP
- **User Agent** - Browser/client information

## 🔍 Error Handling

The API returns appropriate HTTP status codes:

- **200** - Success
- **201** - Created (for new short URLs)
- **302** - Redirect (for shortcode access)
- **400** - Bad Request (invalid input)
- **404** - Not Found (shortcode doesn't exist or expired)
- **500** - Internal Server Error

**Error Response Format:**
```json
{
    "error": "Description of the error"
}
```

## 📝 Logging Integration

The microservice uses the custom Logging Middleware extensively:

- **Service Events** - Server startup, shutdown
- **Request Handling** - All incoming requests
- **Database Operations** - URL creation, retrieval, analytics
- **Error Tracking** - All errors and warnings
- **Debug Information** - Detailed operation logs

Log levels used:
- `info` - General operations
- `warn` - Invalid requests, expired URLs
- `error` - Server errors, failures
- `debug` - Detailed operation information
- `fatal` - Critical system failures

## 🧪 Testing the API

### 1. Create a Short URL
```bash
curl -X POST http://localhost:3000/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/very-long-url-that-needs-shortening",
    "validity": 60,
    "shortcode": "test123"
  }'
```

### 2. Get Statistics
```bash
curl http://localhost:3000/shorturls/test123
```

### 3. Test Redirect
```bash
curl -I http://localhost:3000/test123
```

### 4. Health Check
```bash
curl http://localhost:3000/health
```

## � Screenshot Testing Commands

**For Output-1 Screenshot (POST Request):**
```bash
curl -X POST http://localhost:3000/shorturls \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://very-very-very-long-and-descriptive-subdomain-that-goes-on-and-on.somedomain.com/additional/directory/levels/for/more/length/really-log-sub-domain/a-really-log-page",
    "validity": 30,
    "shortcode": "abcd1"
  }'
```

**For Output-2 Screenshot (GET Request):**
```bash
curl http://localhost:3000/shorturls/abcd1
```

**Expected Responses:**
- **Output-1:** Creates shortcode `abcd1` and returns `shortLink` and `expiry`
- **Output-2:** Shows detailed statistics including `originalUrl`, `createdAt`, `totalClicks`, and `clickDetails`

## �🏗️ Architecture

### Components:
- **server.js** - Main Express application with API routes
- **logger.js** - Logging middleware integration
- **database.js** - In-memory database for URL storage and analytics
- **utils.js** - Utility functions for validation and data processing

### Data Storage:
- **In-Memory Storage** - Fast access for demonstration
- **URL Data** - Original URL, shortcode, expiry, creation time
- **Analytics Data** - Click counts, detailed click information

### Security Features:
- **Input Validation** - URL format validation, shortcode validation
- **Rate Limiting** - Built-in Express security
- **CORS** - Cross-origin resource sharing enabled
- **Helmet** - Security headers

## 📋 Design Decisions

### 1. **In-Memory Storage**
   - Simple and fast for demonstration
   - No external database dependencies
   - Easy to understand and debug

### 2. **Synchronous Logging**
   - Extensive logging for evaluation requirements
   - Non-blocking operation with error handling
   - Automatic token refresh

### 3. **Simple Geolocation**
   - Basic IP-based location detection
   - Privacy-conscious (coarse-grained)
   - Handles local/private IPs gracefully

### 4. **Error-First Design**
   - Comprehensive error handling
   - Clear error messages
   - Appropriate HTTP status codes

## 🚦 Production Considerations

For production deployment, consider:
- **Persistent Database** (MongoDB, PostgreSQL)
- **Redis Caching** for high-performance access
- **Rate Limiting** to prevent abuse
- **Load Balancing** for scalability
- **HTTPS** for security
- **Environment-based Configuration**

## 📚 Dependencies

- **express** - Web framework
- **cors** - Cross-origin resource sharing
- **helmet** - Security headers
- **axios** - HTTP client for logging API
- **geoip-lite** - IP geolocation
