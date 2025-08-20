/**
 * Backend Logging Integration
 * Connects Backend Test Submission to the Logging Middleware
 */

const { Log, logger } = require('../Logging Middleware');

// Configure the logger with credentials on initialization
const credentials = {
    email: "2215045@nec.edu.in",
    name: "Akhil R",
    rollNo: "2215045",
    accessCode: "xsZTTn",
    clientID: "ab109ab6-33c4-4fb6-b83e-935e8e6eb3e2",
    clientSecret: "HpxUpUnrRzvsYKJz"
};

// Initialize logging
logger.setupAuth(credentials);

// Export the main Log function and convenience methods
module.exports = {
    Log,
    
    // Convenience methods for backend operations
    async info(packageName, message) {
        return Log('backend', 'info', packageName, message);
    },

    async error(packageName, message) {
        return Log('backend', 'error', packageName, message);
    },

    async warn(packageName, message) {
        return Log('backend', 'warn', packageName, message);
    },

    async debug(packageName, message) {
        return Log('backend', 'debug', packageName, message);
    },

    async fatal(packageName, message) {
        return Log('backend', 'fatal', packageName, message);
    }
};
