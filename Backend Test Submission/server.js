/**
 * HTTP URL Shortener Microservice
 * A simple and robust URL shortener with analytics
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

// Import modules
const logger = require('./logger');
const database = require('./database');
const Utils = require('./utils');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Request logging middleware
app.use(async (req, res, next) => {
    await Utils.logRequest(req, 'REQUEST_RECEIVED');
    next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
    await logger.info('handler', 'Health check requested');
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

/**
 * POST /shorturls - Create a new short URL
 */
app.post('/shorturls', async (req, res) => {
    try {
        await logger.info('handler', 'Short URL creation requested');
        
        const { url, validity, shortcode } = req.body;

        // Validate required fields
        if (!url) {
            await logger.warn('handler', 'Missing URL in request body');
            return res.status(400).json({ error: 'URL is required' });
        }

        // Validate URL format
        if (!Utils.isValidURL(url)) {
            await logger.warn('handler', `Invalid URL format: ${url}`);
            return res.status(400).json({ error: 'Invalid URL format' });
        }

        // Sanitize inputs
        const sanitizedUrl = Utils.sanitizeInput(url);
        const validityMinutes = validity && Number.isInteger(validity) && validity > 0 ? validity : 30;
        const customShortcode = shortcode ? Utils.sanitizeInput(shortcode, 20) : null;

        await logger.debug('handler', `Creating short URL for: ${sanitizedUrl}, validity: ${validityMinutes} minutes`);

        // Create short URL
        const result = await database.createShortURL(sanitizedUrl, validityMinutes, customShortcode);
        
        const shortLink = `http://${HOST}:${PORT}/${result.shortcode}`;
        
        await logger.info('handler', `Short URL created successfully: ${result.shortcode}`);
        
        res.status(201).json({
            shortLink: shortLink,
            expiry: result.expiry
        });

    } catch (error) {
        await logger.error('handler', `Short URL creation failed: ${error.message}`);
        
        if (error.message.includes('Shortcode already exists') || error.message.includes('Invalid shortcode format')) {
            return res.status(400).json({ error: error.message });
        }
        
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /shorturls/:shortcode - Get statistics for a short URL
 */
app.get('/shorturls/:shortcode', async (req, res) => {
    try {
        const { shortcode } = req.params;
        
        await logger.info('handler', `Statistics requested for shortcode: ${shortcode}`);

        // Validate shortcode format
        if (!shortcode || shortcode.length < 3) {
            await logger.warn('handler', `Invalid shortcode requested: ${shortcode}`);
            return res.status(400).json({ error: 'Invalid shortcode format' });
        }

        // Get statistics
        const stats = await database.getStatistics(shortcode);
        
        if (!stats) {
            await logger.warn('handler', `Statistics not found for shortcode: ${shortcode}`);
            return res.status(404).json({ error: 'Short URL not found' });
        }

        await logger.info('handler', `Statistics retrieved for shortcode: ${shortcode}`);
        
        res.json({
            shortcode: stats.shortcode,
            originalUrl: stats.originalUrl,
            createdAt: stats.createdAt,
            expiry: stats.expiry,
            totalClicks: stats.totalClicks,
            isExpired: stats.isExpired,
            clickDetails: stats.clickDetails
        });

    } catch (error) {
        await logger.error('handler', `Statistics retrieval failed: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * GET /:shortcode - Redirect to original URL
 */
app.get('/:shortcode', async (req, res) => {
    try {
        const { shortcode } = req.params;
        
        await logger.info('handler', `Redirect requested for shortcode: ${shortcode}`);

        // Skip certain paths that shouldn't be treated as shortcodes
        if (['favicon.ico', 'health', 'shorturls'].includes(shortcode)) {
            return res.status(404).json({ error: 'Not found' });
        }

        // Get original URL
        const originalUrl = await database.getOriginalURL(shortcode);
        
        if (!originalUrl) {
            await logger.warn('handler', `Redirect failed - URL not found or expired: ${shortcode}`);
            return res.status(404).json({ error: 'Short URL not found or expired' });
        }

        // Record click analytics
        const clickData = Utils.getClickData(req);
        await database.recordClick(shortcode, clickData);
        
        await logger.info('handler', `Redirecting ${shortcode} to ${originalUrl}`);
        
        // Redirect to original URL
        res.redirect(302, originalUrl);

    } catch (error) {
        await logger.error('handler', `Redirect failed: ${error.message}`);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// 404 handler
app.use(async (req, res) => {
    await logger.warn('handler', `404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use(async (error, req, res, next) => {
    await logger.error('middleware', `Unhandled error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, async () => {
    await logger.info('service', `URL Shortener Microservice started on http://${HOST}:${PORT}`);
    console.log(`🚀 URL Shortener Microservice running on http://${HOST}:${PORT}`);
    console.log(`📊 Health check available at http://${HOST}:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await logger.info('service', 'Server shutting down gracefully');
    console.log('\n👋 Server shutting down gracefully');
    process.exit(0);
});

module.exports = app;