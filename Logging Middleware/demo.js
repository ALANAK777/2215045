/**
 * Simple demo showing the enhanced logging middleware in action
 */

const { Log, logger } = require('./index');

// Your credentials (already configured)
const credentials = {
    email: "2215045@nec.edu.in",
    name: "Akhil R",
    rollNo: "2215045",
    accessCode: "xsZTTn",
    clientID: "ab109ab6-33c4-4fb6-b83e-935e8e6eb3e2",
    clientSecret: "HpxUpUnrRzvsYKJz"
};

async function demonstrateLogging() {
    console.log('🚀 Enhanced Logging Middleware Demo\n');
    
    // Step 1: One-time setup
    console.log('1. Setting up authentication...');
    logger.setupAuth(credentials);
    console.log('✅ Setup complete!\n');
    
    // Step 2: Use logging (authentication happens automatically)
    console.log('2. Testing different log types...\n');
    
    // Simulate application startup logs
    await Log('backend', 'info', 'config', 'Application configuration loaded');
    await Log('backend', 'info', 'db', 'Database connection established');
    await Log('backend', 'info', 'auth', 'Authentication middleware initialized');
    
    // Simulate API request logs
    await Log('backend', 'info', 'handler', 'Processing user registration request');
    await Log('backend', 'warn', 'handler', 'Email validation warning: domain not common');
    await Log('backend', 'info', 'service', 'User profile created successfully');
    
    // Simulate error scenarios
    await Log('backend', 'error', 'handler', 'Invalid request payload received');
    await Log('backend', 'fatal', 'db', 'Critical: Database connection lost');
    
    console.log('\n3. Checking authentication status...');
    const status = logger.getAuthStatus();
    console.log(`✅ Token valid: ${status.isValid}`);
    console.log(`✅ Time until expiry: ${Math.round(status.timeUntilExpiry / 60000)} minutes`);
    
    console.log('\n🎉 Demo complete! Your logs are being sent to the evaluation server.');
    console.log('\n💡 Key Benefits:');
    console.log('   • No manual token management needed');
    console.log('   • Automatic token refresh before expiry');
    console.log('   • Simple one-time setup');
    console.log('   • Works seamlessly in any backend application');
}

// Run demo
demonstrateLogging().catch(console.error);
