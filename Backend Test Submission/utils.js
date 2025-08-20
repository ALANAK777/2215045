/**
 * Utility functions for URL Shortener
 */

const geoip = require('geoip-lite');
const logger = require('./logger');

class Utils {
    /**
     * Validate URL format
     */
    static isValidURL(string) {
        try {
            new URL(string);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get geolocation from IP address
     */
    static getLocationFromIP(ip) {
        try {
            // Skip local/private IPs
            if (ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
                return 'Local';
            }

            const geo = geoip.lookup(ip);
            if (geo) {
                return `${geo.city || 'Unknown'}, ${geo.country || 'Unknown'}`;
            }
            return 'Unknown';
        } catch (error) {
            logger.debug('utils', `Geolocation lookup failed for IP ${ip}: ${error.message}`);
            return 'Unknown';
        }
    }

    /**
     * Extract domain from referrer URL
     */
    static extractDomain(url) {
        try {
            if (!url) return 'direct';
            const parsedUrl = new URL(url);
            return parsedUrl.hostname;
        } catch (error) {
            return 'unknown';
        }
    }

    /**
     * Sanitize user input
     */
    static sanitizeInput(input, maxLength = 2000) {
        if (typeof input !== 'string') return '';
        return input.trim().substring(0, maxLength);
    }

    /**
     * Create standardized API response
     */
    static createResponse(success, data = null, error = null, statusCode = 200) {
        const response = { success };
        
        if (success && data) {
            return { ...data };
        } else if (!success && error) {
            return { error };
        }
        
        return response;
    }

    /**
     * Log request details
     */
    static async logRequest(req, action) {
        const ip = req.ip || req.connection.remoteAddress || 'unknown';
        const userAgent = req.get('User-Agent') || 'unknown';
        const method = req.method;
        const path = req.path;
        
        await logger.info('handler', `${action}: ${method} ${path} from ${ip}`);
    }

    /**
     * Get click data from request
     */
    static getClickData(req) {
        const ip = req.ip || req.connection.remoteAddress || '127.0.0.1';
        const referrer = req.get('Referer') || req.get('Referrer') || 'direct';
        const userAgent = req.get('User-Agent') || 'unknown';
        const location = this.getLocationFromIP(ip);

        return {
            ip: ip,
            referrer: this.extractDomain(referrer),
            userAgent: userAgent,
            location: location
        };
    }
}

module.exports = Utils;
