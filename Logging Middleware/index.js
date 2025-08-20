const axios = require('axios');
const AuthManager = require('./auth-manager');

/**
 * Logging Middleware - A simple reusable logging package
 * Makes API calls to the evaluation server to log application events
 * Now with automatic authentication and token management
 */

class Logger {
    constructor() {
        this.baseURL = 'http://20.244.56.144/evaluation-service';
        this.logEndpoint = `${this.baseURL}/logs`;
        this.authManager = new AuthManager();
        
        // Valid values as per API specification
        this.validStacks = ['backend', 'frontend'];
        this.validLevels = ['debug', 'info', 'warn', 'error', 'fatal'];
        this.validPackages = [
            // Backend only packages
            'cache', 'controller', 'cron_job', 'db', 'domain', 
            'handler', 'repository', 'route', 'service',
            // Frontend only packages  
            'api', 'component', 'hook', 'page', 'state', 'style',
            // Common packages
            'auth', 'config', 'middleware', 'utils'
        ];
    }

    /**
     * Setup authentication with your credentials
     * @param {Object} credentials - Your registration credentials
     */
    setupAuth(credentials) {
        const { email, name, rollNo, accessCode, clientID, clientSecret } = credentials;
        this.authManager.setCredentials(email, name, rollNo, accessCode, clientID, clientSecret);
        console.log('[LOGGER] Authentication credentials configured');
    }

    /**
     * Set existing token (if you already have a valid token)
     * @param {string} accessToken - Bearer token
     * @param {number} expiresIn - Token expiry timestamp
     */
    setExistingToken(accessToken, expiresIn) {
        this.authManager.setToken(accessToken, expiresIn);
        console.log('[LOGGER] Existing token configured');
    }

    /**
     * Get current authentication status
     */
    getAuthStatus() {
        return this.authManager.getTokenInfo();
    }

    /**
     * Set the authorization token for API calls (legacy method)
     * @param {string} token - Bearer token from authentication
     */
    setAuthToken(token) {
        // Legacy support - just store as current token without expiry
        this.authManager.currentToken = token;
        this.authManager.tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // Assume 15 min expiry
    }

    /**
     * Set the authorization token for API calls (legacy method)
     * @param {string} token - Bearer token from authentication
     */
    setAuthToken(token) {
        // Legacy support - just store as current token without expiry
        this.authManager.currentToken = token;
        this.authManager.tokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // Assume 15 min expiry
    }

    /**
     * Validate input parameters
     * @param {string} stack - Application stack (backend/frontend)
     * @param {string} level - Log level (debug/info/warn/error/fatal)
     * @param {string} packageName - Package name
     * @param {string} message - Log message
     */
    validateParams(stack, level, packageName, message) {
        if (!this.validStacks.includes(stack)) {
            throw new Error(`Invalid stack: ${stack}. Must be one of: ${this.validStacks.join(', ')}`);
        }
        
        if (!this.validLevels.includes(level)) {
            throw new Error(`Invalid level: ${level}. Must be one of: ${this.validLevels.join(', ')}`);
        }
        
        if (!this.validPackages.includes(packageName)) {
            throw new Error(`Invalid package: ${packageName}. Must be one of: ${this.validPackages.join(', ')}`);
        }
        
        if (!message || typeof message !== 'string') {
            throw new Error('Message must be a non-empty string');
        }
    }

    /**
     * Main logging function - sends log to evaluation server
     * @param {string} stack - Application stack (backend/frontend)
     * @param {string} level - Log level (debug/info/warn/error/fatal)
     * @param {string} packageName - Package name where log originated
     * @param {string} message - Descriptive log message
     * @returns {Promise} - API response or error
     */
    async Log(stack, level, packageName, message) {
        try {
            // Validate parameters
            this.validateParams(stack, level, packageName, message);
            
            // Get valid token (will refresh if needed)
            const authToken = await this.authManager.getValidToken();
            
            if (!authToken) {
                throw new Error('Unable to get valid auth token. Check credentials and network.');
            }

            // Prepare request payload
            const logData = {
                stack: stack.toLowerCase(),
                level: level.toLowerCase(),
                package: packageName.toLowerCase(),
                message: message
            };

            // Make API call
            const response = await axios.post(this.logEndpoint, logData, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'application/json'
                },
                timeout: 5000 // 5 second timeout
            });

            // Log success locally for debugging
            console.log(`[LOG SUCCESS] ${level.toUpperCase()} - ${packageName}: ${message}`);
            console.log(`[LOG ID] ${response.data.logID}`);
            
            return {
                success: true,
                logID: response.data.logID,
                message: response.data.message
            };

        } catch (error) {
            // Handle different types of errors
            let errorMessage = 'Unknown error occurred';
            
            if (error.response) {
                // API error response
                errorMessage = `API Error: ${error.response.status} - ${error.response.data?.message || 'Server error'}`;
            } else if (error.request) {
                // Network error
                errorMessage = 'Network Error: Could not reach logging server';
            } else {
                // Validation or other error
                errorMessage = error.message;
            }

            console.error(`[LOG ERROR] Failed to log: ${errorMessage}`);
            
            return {
                success: false,
                error: errorMessage
            };
        }
    }

    /**
     * Convenience methods for different log levels
     */
    async debug(stack, packageName, message) {
        return this.Log(stack, 'debug', packageName, message);
    }

    async info(stack, packageName, message) {
        return this.Log(stack, 'info', packageName, message);
    }

    async warn(stack, packageName, message) {
        return this.Log(stack, 'warn', packageName, message);
    }

    async error(stack, packageName, message) {
        return this.Log(stack, 'error', packageName, message);
    }

    async fatal(stack, packageName, message) {
        return this.Log(stack, 'fatal', packageName, message);
    }
}

// Create a singleton instance
const logger = new Logger();

// Export the main Log function and logger instance
module.exports = {
    Log: logger.Log.bind(logger),
    Logger,
    logger
};
