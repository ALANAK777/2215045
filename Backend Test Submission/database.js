

const logger = require('./logger');

class URLDatabase {
    constructor() {
        
        this.urls = new Map(); 
        this.analytics = new Map(); 
        
        logger.info('db', 'In-memory database initialized');
    }


    generateShortcode(length = 5) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }


    exists(shortcode) {
        return this.urls.has(shortcode);
    }


    isValidShortcode(shortcode) {
       
        const regex = /^[A-Za-z0-9]{3,20}$/;
        return regex.test(shortcode);
    }

   
    isExpired(shortcode) {
        const urlData = this.urls.get(shortcode);
        if (!urlData) return true;
        return new Date() > new Date(urlData.expiry);
    }

    
    async createShortURL(originalUrl, validityMinutes = 30, customShortcode = null) {
        try {
            let shortcode = customShortcode;

        
            if (customShortcode) {
                if (!this.isValidShortcode(customShortcode)) {
                    throw new Error('Invalid shortcode format. Use 3-20 alphanumeric characters.');
                }
                if (this.exists(customShortcode)) {
                    throw new Error('Shortcode already exists. Please choose a different one.');
                }
            } else {
                
                do {
                    shortcode = this.generateShortcode();
                } while (this.exists(shortcode));
            }

            
            const expiry = new Date(Date.now() + validityMinutes * 60 * 1000);

            
            const urlData = {
                originalUrl,
                shortcode,
                expiry: expiry.toISOString(),
                createdAt: new Date().toISOString(),
                validityMinutes
            };

            this.urls.set(shortcode, urlData);

           
            this.analytics.set(shortcode, {
                totalClicks: 0,
                clicks: []
            });

            await logger.info('db', `Short URL created: ${shortcode} -> ${originalUrl}`);
            
            return { shortcode, expiry: urlData.expiry };

        } catch (error) {
            await logger.error('db', `Failed to create short URL: ${error.message}`);
            throw error;
        }
    }


    async getOriginalURL(shortcode) {
        try {
            if (!this.exists(shortcode)) {
                await logger.warn('db', `Shortcode not found: ${shortcode}`);
                return null;
            }

            if (this.isExpired(shortcode)) {
                await logger.warn('db', `Shortcode expired: ${shortcode}`);
                return null;
            }

            const urlData = this.urls.get(shortcode);
            await logger.debug('db', `Retrieved URL for shortcode: ${shortcode}`);
            
            return urlData.originalUrl;

        } catch (error) {
            await logger.error('db', `Failed to get original URL: ${error.message}`);
            return null;
        }
    }


    async recordClick(shortcode, clickData) {
        try {
            if (!this.analytics.has(shortcode)) {
                await logger.warn('db', `Analytics not found for shortcode: ${shortcode}`);
                return false;
            }

            const analytics = this.analytics.get(shortcode);
            analytics.totalClicks++;
            analytics.clicks.push({
                timestamp: new Date().toISOString(),
                referrer: clickData.referrer || 'direct',
                userAgent: clickData.userAgent || 'unknown',
                ip: clickData.ip || 'unknown',
                location: clickData.location || 'unknown'
            });

            await logger.debug('db', `Click recorded for shortcode: ${shortcode}`);
            return true;

        } catch (error) {
            await logger.error('db', `Failed to record click: ${error.message}`);
            return false;
        }
    }


    async getStatistics(shortcode) {
        try {
            if (!this.exists(shortcode)) {
                await logger.warn('db', `Statistics requested for non-existent shortcode: ${shortcode}`);
                return null;
            }

            const urlData = this.urls.get(shortcode);
            const analytics = this.analytics.get(shortcode) || { totalClicks: 0, clicks: [] };

            const stats = {
                shortcode,
                originalUrl: urlData.originalUrl,
                createdAt: urlData.createdAt,
                expiry: urlData.expiry,
                validityMinutes: urlData.validityMinutes,
                totalClicks: analytics.totalClicks,
                isExpired: this.isExpired(shortcode),
                clickDetails: analytics.clicks.map(click => ({
                    timestamp: click.timestamp,
                    referrer: click.referrer,
                    location: click.location
                }))
            };

            await logger.debug('db', `Statistics retrieved for shortcode: ${shortcode}`);
            return stats;

        } catch (error) {
            await logger.error('db', `Failed to get statistics: ${error.message}`);
            return null;
        }
    }

    async cleanupExpired() {
        try {
            let cleanedCount = 0;
            for (const [shortcode, urlData] of this.urls.entries()) {
                if (new Date() > new Date(urlData.expiry)) {
                    this.urls.delete(shortcode);
                    this.analytics.delete(shortcode);
                    cleanedCount++;
                }
            }
            
            if (cleanedCount > 0) {
                await logger.info('db', `Cleaned up ${cleanedCount} expired URLs`);
            }
            
            return cleanedCount;
        } catch (error) {
            await logger.error('db', `Cleanup failed: ${error.message}`);
            return 0;
        }
    }
}

module.exports = new URLDatabase();
