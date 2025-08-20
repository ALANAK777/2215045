const axios = require('axios');


class AuthManager {
    constructor() {
        this.baseURL = 'http://20.244.56.144/evaluation-service';
        this.authEndpoint = `${this.baseURL}/auth`;
        
      
        this.credentials = null;
        this.currentToken = null;
        this.tokenExpiry = null;
        
        
        this.refreshBuffer = 5 * 60 * 1000; 
    }


    setCredentials(email, name, rollNo, accessCode, clientID, clientSecret) {
        this.credentials = {
            email,
            name,
            rollNo,
            accessCode,
            clientID,
            clientSecret
        };
    }

    setToken(accessToken, expiresIn) {
        this.currentToken = accessToken;
      
        if (typeof expiresIn === 'number') {
            this.tokenExpiry = new Date(expiresIn * 1000);
        }
        console.log(`[AUTH] Token set, expires at: ${this.tokenExpiry}`);
    }


    isTokenValid() {
        if (!this.currentToken || !this.tokenExpiry) {
            return false;
        }
        
        const now = new Date();
        const expiryWithBuffer = new Date(this.tokenExpiry.getTime() - this.refreshBuffer);
        
        return now < expiryWithBuffer;
    }

    async getValidToken() {

        if (this.isTokenValid()) {
            return this.currentToken;
        }

       
        console.log('[AUTH] Token expired or missing, refreshing...');
        return await this.refreshToken();
    }

    async refreshToken() {
        if (!this.credentials) {
            throw new Error('Credentials not set. Call setCredentials() first.');
        }

        try {
            const response = await axios.post(this.authEndpoint, this.credentials, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 10000 
            });

            if (response.status === 200 || response.status === 201) {
                const { access_token, expires_in } = response.data;
                
                this.currentToken = access_token;
                this.tokenExpiry = new Date(expires_in * 1000);
                
                console.log(`[AUTH] Token refreshed successfully, expires at: ${this.tokenExpiry}`);
                return this.currentToken;
            } else {
                throw new Error(`Authentication failed with status: ${response.status}`);
            }

        } catch (error) {
            let errorMessage = 'Authentication failed';
            
            if (error.response) {
                errorMessage = `Auth API Error: ${error.response.status} - ${error.response.data?.message || 'Server error'}`;
            } else if (error.request) {
                errorMessage = 'Auth Network Error: Could not reach authentication server';
            } else {
                errorMessage = error.message;
            }

            console.error(`[AUTH ERROR] ${errorMessage}`);
            throw new Error(errorMessage);
        }
    }

    getTokenInfo() {
        return {
            hasToken: !!this.currentToken,
            isValid: this.isTokenValid(),
            expiry: this.tokenExpiry,
            timeUntilExpiry: this.tokenExpiry ? Math.max(0, this.tokenExpiry.getTime() - Date.now()) : 0
        };
    }
}

module.exports = AuthManager;
