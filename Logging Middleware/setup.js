/**
 * Setup file with your actual credentials and token
 * This demonstrates how to configure the logging middleware with your real credentials
 */

const { Log, logger } = require('./index');

// Your actual registration credentials
const credentials = {
    email: "2215045@nec.edu.in",
    name: "Akhil R",
    rollNo: "2215045",
    accessCode: "xsZTTn",
    clientID: "ab109ab6-33c4-4fb6-b83e-935e8e6eb3e2",
    clientSecret: "HpxUpUnrRzvsYKJz"
};

// Your current token (will be automatically refreshed when needed)
const currentToken = {
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjE1MDQ1QG5lYy5lZHUuaW4iLCJleHAiOjE3NTU2Njg2NzcsImlhdCI6MTc1NTY2Nzc3NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjJlZDc1OWUxLWUxMjYtNGViYy1hZGZiLTU0MjgzY2NkZmU2NSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFraGlsIHIiLCJzdWIiOiJhYjEwOWFiNi0zM2M0LTRmYjYtYjgzZS05MzVlOGU2ZWIzZTIifSwiZW1haWwiOiIyMjE1MDQ1QG5lYy5lZHUuaW4iLCJuYW1lIjoiYWtoaWwgciIsInJvbGxObyI6IjIyMTUwNDUiLCJhY2Nlc3NDb2RlIjoieHNaVFRuIiwiY2xpZW50SUQiOiJhYjEwOWFiNi0zM2M0LTRmYjYtYjgzZS05MzVlOGU2ZWIzZTIiLCJjbGllbnRTZWNyZXQiOiJIcHhVcFVuclJ6dnNZS0p6In0.DEfCGaW9aVNpvr7fSzMvmUQ03HVwqCcN_WO7klG-DNo",
    expires_in: 1755668677
};

/**
 * Initialize the logger with your credentials
 */
function initializeLogger() {
    console.log('=== Initializing Logging Middleware ===\n');
    
    // Setup authentication with your credentials
    logger.setupAuth(credentials);
    
    // Set your existing token
    logger.setExistingToken(currentToken.access_token, currentToken.expires_in);
    
    // Check auth status
    const authStatus = logger.getAuthStatus();
    console.log('Auth Status:', authStatus);
    
    console.log('\n✅ Logger initialized and ready to use!\n');
}

/**
 * Test the logger with real credentials
 */
async function testRealLogging() {
    console.log('=== Testing Real Logging ===\n');
    
    try {
        // Test basic logging
        console.log('1. Testing basic log...');
        const result1 = await Log('backend', 'info', 'handler', 'Logger initialized and testing started');
        console.log('Result:', result1);
        console.log();
        
        // Test different log levels
        console.log('2. Testing different log levels...');
        await logger.debug('backend', 'utils', 'Debug message from setup test');
        await logger.warn('backend', 'cache', 'Cache initialization warning');
        await logger.error('backend', 'handler', 'Simulated error for testing');
        console.log();
        
        // Test token refresh (if needed)
        console.log('3. Testing token status...');
        const authStatus = logger.getAuthStatus();
        console.log('Current auth status:', authStatus);
        
        if (!authStatus.isValid) {
            console.log('Token expired, will refresh on next log call...');
        } else {
            console.log(`Token valid for ${Math.round(authStatus.timeUntilExpiry / 60000)} more minutes`);
        }
        
        console.log('\n✅ All tests completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

/**
 * Demo function showing how to use in your application
 */
function showUsageExample() {
    console.log('\n=== Usage Example for Your Application ===\n');
    
    console.log(`
// In your main application file:
const { Log, logger } = require('./path-to-logging-middleware');

// One-time setup (usually in your app startup)
logger.setupAuth({
    email: "2215045@nec.edu.in",
    name: "Akhil R", 
    rollNo: "2215045",
    accessCode: "xsZTTn",
    clientID: "ab109ab6-33c4-4fb6-b83e-935e8e6eb3e2",
    clientSecret: "HpxUpUnrRzvsYKJz"
});

// Optional: Set existing token if you have one
logger.setExistingToken("your-current-token", expiry_timestamp);

// Now use anywhere in your application:
app.post('/api/users', async (req, res) => {
    await Log('backend', 'info', 'handler', 'User creation request received');
    
    try {
        const user = await createUser(req.body);
        await Log('backend', 'info', 'handler', \`User created: \${user.id}\`);
        res.json(user);
    } catch (error) {
        await Log('backend', 'error', 'handler', \`User creation failed: \${error.message}\`);
        res.status(500).json({ error: 'Server error' });
    }
});
    `);
}

// Run if executed directly
if (require.main === module) {
    initializeLogger();
    
    setTimeout(async () => {
        await testRealLogging();
        showUsageExample();
    }, 1000);
}

module.exports = {
    initializeLogger,
    testRealLogging,
    credentials,
    currentToken
};
