# Logging Middleware

A simple and reusable logging middleware package that sends application logs to the evaluation server with **automatic authentication and token management**.

## 🚀 New Features

- ✅ **Automatic Token Management** - Handles token expiry and refreshes automatically
- ✅ **One-time Setup** - Configure once with your credentials, use everywhere
- ✅ **Smart Token Refresh** - Refreshes tokens 5 minutes before expiry
- ✅ **Seamless Integration** - No need to manually manage authentication
- ✅ **Real Credentials Ready** - Pre-configured with your actual credentials

## Features

- ✅ Simple `Log(stack, level, package, message)` function signature
- ✅ Input validation for all parameters
- ✅ Automatic Bearer token authentication and refresh
- ✅ Error handling and fallback logging
- ✅ Convenience methods for different log levels
- ✅ Reusable across different applications
- ✅ Token expiry monitoring and automatic refresh

## Quick Start

```bash
npm install
npm run setup    # Test with your real credentials
```

## Usage

### Easy Setup (Recommended)

```javascript
const { Log, logger } = require('./index');

// One-time setup with your credentials (usually in app startup)
logger.setupAuth({
    email: "2215045@nec.edu.in",
    name: "Akhil R", 
    rollNo: "2215045",
    accessCode: "xsZTTn",
    clientID: "ab109ab6-33c4-4fb6-b83e-935e8e6eb3e2",
    clientSecret: "HpxUpUnrRzvsYKJz"
});

// That's it! Now use logging anywhere in your app:
await Log('backend', 'info', 'handler', 'User authentication successful');
```

### Advanced Setup (With Existing Token)

```javascript
const { Log, logger } = require('./index');

// Setup credentials
logger.setupAuth(yourCredentials);

// If you have an existing valid token, set it to avoid immediate refresh
logger.setExistingToken('your-current-token', expiry_timestamp);

// Use logging
await Log('backend', 'error', 'handler', 'Invalid input data received');
```

### Convenience Methods

```javascript
const { logger } = require('./index');

// Setup once
logger.setupAuth(yourCredentials);

// Use convenience methods anywhere
await logger.info('backend', 'service', 'Database connection established');
await logger.error('backend', 'handler', 'Invalid input data received');
await logger.warn('backend', 'cache', 'Cache miss for user session');
await logger.debug('backend', 'utils', 'Processing user preferences');
await logger.fatal('backend', 'db', 'Critical database connection failure');
```

### Check Authentication Status

```javascript
// Check current token status
const status = logger.getAuthStatus();
console.log('Token valid:', status.isValid);
console.log('Minutes until expiry:', Math.round(status.timeUntilExpiry / 60000));
```

## Real-World Example

Here's how your logs appear in the evaluation system:

```
✅ [LOG SUCCESS] INFO - handler: User authentication successful
✅ [LOG ID] 442ceff1-d1a5-4c5e-80b9-2d47d9c9e98f

✅ [LOG SUCCESS] ERROR - handler: Invalid input data received  
✅ [LOG ID] a139b027-d7a7-46e7-8ee8-1777945c1f45
```

## API Reference

### Main Function

```javascript
Log(stack, level, package, message)
```

**Parameters:**
- `stack` (string): Application stack - 'backend' or 'frontend'
- `level` (string): Log level - 'debug', 'info', 'warn', 'error', or 'fatal'  
- `package` (string): Package/module name where log originated
- `message` (string): Descriptive log message

**Returns:** Promise with result object

### Valid Values

**Stack Values:**
- `backend`
- `frontend`

**Level Values:**
- `debug` - Detailed information for debugging
- `info` - General informational messages
- `warn` - Warning messages for potential issues
- `error` - Error messages for handled exceptions
- `fatal` - Critical errors that may cause application failure

**Package Values:**

*Backend Only:*
- `cache`, `controller`, `cron_job`, `db`, `domain`, `handler`, `repository`, `route`, `service`

*Frontend Only:*
- `api`, `component`, `hook`, `page`, `state`, `style`

*Common (Both):*
- `auth`, `config`, `middleware`, `utils`

## Example Usage in Applications

### Backend Application Example

```javascript
const { Log, logger } = require('./path-to-logging-middleware');

// One-time setup (in your app startup)
logger.setupAuth({
    email: "your-email@college.edu",
    name: "Your Name",
    rollNo: "your-roll-number", 
    accessCode: "your-access-code",
    clientID: "your-client-id",
    clientSecret: "your-client-secret"
});

// In your handlers - automatic authentication!
app.post('/api/users', async (req, res) => {
    try {
        await Log('backend', 'info', 'handler', 'Processing new user registration');
        
        // Your business logic here
        const user = await createUser(req.body);
        
        await Log('backend', 'info', 'handler', `User created successfully: ${user.id}`);
        res.json(user);
        
    } catch (error) {
        await Log('backend', 'error', 'handler', `User creation failed: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// In your database layer
async function connectDB() {
    try {
        await Log('backend', 'info', 'db', 'Attempting database connection');
        // Connection logic
        await Log('backend', 'info', 'db', 'Database connected successfully');
    } catch (error) {
        await Log('backend', 'fatal', 'db', `Database connection failed: ${error.message}`);
    }
}
```

## 🔧 Smart Features

### Automatic Token Refresh
- Monitors token expiry continuously
- Refreshes tokens 5 minutes before expiry
- No interruption to your logging flow
- Handles network errors gracefully

### Error Handling

The middleware includes comprehensive error handling:

```javascript
const result = await Log('backend', 'info', 'handler', 'Test message');

if (result.success) {
    console.log('✅ Log sent successfully:', result.logID);
} else {
    console.log('❌ Log failed:', result.error);
}
```

## Authentication

### New Way (Recommended)
```javascript
// Set up once with your credentials - handles everything automatically
logger.setupAuth({
    email: "2215045@nec.edu.in",
    name: "Akhil R",
    rollNo: "2215045", 
    accessCode: "xsZTTn",
    clientID: "ab109ab6-33c4-4fb6-b83e-935e8e6eb3e2",
    clientSecret: "HpxUpUnrRzvsYKJz"
});
```

### Legacy Way (Still Supported)
```javascript
// Manual token management (not recommended)
logger.setAuthToken('your-bearer-token-here');
```

## Notes

- All values are automatically converted to lowercase as required by the API
- The middleware includes input validation to prevent invalid API calls
- Failed API calls are logged locally for debugging
- Network timeouts are set to 5 seconds
- The package is designed to be reusable across different applications
