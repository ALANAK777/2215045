/**
 * Test file for the Logging Middleware
 * This demonstrates how to use the logging middleware in your applications
 */

const { Log, logger } = require('./index');

// Example usage function
async function testLoggingMiddleware() {
    console.log('=== Logging Middleware Test ===\n');
    
    // Note: You need to set a real auth token to actually send logs to the server
    // For testing without a token, these will show validation and error handling
    
    console.log('1. Testing without auth token (should show error):');
    const result1 = await Log('backend', 'info', 'handler', 'Test message without token');
    console.log('Result:', result1);
    console.log();
    
    // Simulate setting an auth token (use your real token here)
    console.log('2. Setting auth token...');
    logger.setAuthToken('your-auth-token-here'); // Replace with real token
    console.log();
    
    console.log('3. Testing with auth token (will fail without real token):');
    const result2 = await Log('backend', 'info', 'handler', 'User authentication successful');
    console.log('Result:', result2);
    console.log();
    
    console.log('4. Testing convenience methods:');
    await logger.error('backend', 'handler', 'Invalid input data received');
    await logger.warn('backend', 'cache', 'Cache miss for user session');
    await logger.debug('backend', 'utils', 'Processing user preferences');
    console.log();
    
    console.log('5. Testing validation (should show validation errors):');
    
    // Invalid stack
    const result3 = await Log('invalid', 'info', 'handler', 'Test message');
    console.log('Invalid stack result:', result3);
    
    // Invalid level  
    const result4 = await Log('backend', 'invalid', 'handler', 'Test message');
    console.log('Invalid level result:', result4);
    
    // Invalid package
    const result5 = await Log('backend', 'info', 'invalid', 'Test message');
    console.log('Invalid package result:', result5);
    
    console.log('\n=== Test Complete ===');
}

// Example integration in a typical application
function exampleApplicationUsage() {
    console.log('\n=== Example Application Usage ===\n');
    
    // Example: Express.js route handler
    console.log('Example in Express.js route:');
    console.log(`
app.post('/api/users', async (req, res) => {
    try {
        await Log('backend', 'info', 'handler', 'Processing new user registration');
        
        // Validate input
        if (!req.body.email) {
            await Log('backend', 'warn', 'handler', 'Missing email in user registration');
            return res.status(400).json({ error: 'Email required' });
        }
        
        // Create user
        const user = await createUser(req.body);
        await Log('backend', 'info', 'handler', \`User created: \${user.id}\`);
        
        res.json(user);
    } catch (error) {
        await Log('backend', 'error', 'handler', \`User creation failed: \${error.message}\`);
        res.status(500).json({ error: 'Internal server error' });
    }
});
    `);
    
    console.log('Example in database service:');
    console.log(`
async function connectDatabase() {
    try {
        await Log('backend', 'info', 'db', 'Attempting database connection');
        // Connection logic here
        await Log('backend', 'info', 'db', 'Database connected successfully');
    } catch (error) {
        await Log('backend', 'fatal', 'db', \`Database connection failed: \${error.message}\`);
        throw error;
    }
}
    `);
}

// Run tests if this file is executed directly
if (require.main === module) {
    testLoggingMiddleware()
        .then(() => exampleApplicationUsage())
        .catch(console.error);
}

module.exports = {
    testLoggingMiddleware,
    exampleApplicationUsage
};
