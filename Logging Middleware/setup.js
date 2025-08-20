const { Log, logger } = require('./index');

const credentials = {
    email: "2215045@nec.edu.in",
    name: "Akhil R",
    rollNo: "2215045",
    accessCode: "xsZTTn",
    clientID: "ab109ab6-33c4-4fb6-b83e-935e8e6eb3e2",
    clientSecret: "HpxUpUnrRzvsYKJz"
};

const currentToken = {
    access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiIyMjE1MDQ1QG5lYy5lZHUuaW4iLCJleHAiOjE3NTU2Njg2NzcsImlhdCI6MTc1NTY2Nzc3NywiaXNzIjoiQWZmb3JkIE1lZGljYWwgVGVjaG5vbG9naWVzIFByaXZhdGUgTGltaXRlZCIsImp0aSI6IjJlZDc1OWUxLWUxMjYtNGViYy1hZGZiLTU0MjgzY2NkZmU2NSIsImxvY2FsZSI6ImVuLUlOIiwibmFtZSI6ImFraGlsIHIiLCJzdWIiOiJhYjEwOWFiNi0zM2M0LTRmYjYtYjgzZS05MzVlOGU2ZWIzZTIifSwiZW1haWwiOiIyMjE1MDQ1QG5lYy5lZHUuaW4iLCJuYW1lIjoiYWtoaWwgciIsInJvbGxObyI6IjIyMTUwNDUiLCJhY2Nlc3NDb2RlIjoieHNaVFRuIiwiY2xpZW50SUQiOiJhYjEwOWFiNi0zM2M0LTRmYjYtYjgzZS05MzVlOGU2ZWIzZTIiLCJjbGllbnRTZWNyZXQiOiJIcHhVcFVuclJ6dnNZS0p6In0.DEfCGaW9aVNpvr7fSzMvmUQ03HVwqCcN_WO7klG-DNo",
    expires_in: 1755668677
};

function initializeLogger() {
    console.log('=== Initializing Logging Middleware ===\n');
    
    logger.setupAuth(credentials);
    
    logger.setExistingToken(currentToken.access_token, currentToken.expires_in);
    
    const authStatus = logger.getAuthStatus();
    console.log('Auth Status:', authStatus);
    
    console.log('\n✅ Logger initialized and ready to use!\n');
}



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
