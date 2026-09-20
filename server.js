const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();
const PORT = process.env.PORT || 3000;

// Simple home page layout where users can input a URL
app.get('/', (req, res) => {
    res.send(`
        <html>
            <body style="font-family: Arial; text-align: center; padding-top: 50px;">
                <h2>Private Web Router Portal</h2>
                <form action="/go" method="GET">
                    <input type="text" name="url" placeholder="https://example.com" style="width: 300px; padding: 10px;" required />
                    <button type="submit" style="padding: 10px;">Go</button>
                </form>
            </body>
        </html>
    `);
});

// Middleware router that intercept requests and handles redirection
app.use('/go', (req, res, next) => {
    const targetUrl = req.query.url;
    
    if (!targetUrl) {
        return res.status(400).send('Please provide a valid destination target URL.');
    }

    // Dynamic routing engine
    createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        followRedirects: true,
        pathRewrite: (path, req) => {
            // Strips out the initial local proxy endpoint string
            return ''; 
        },
        onError: (err, req, res) => {
            res.status(500).send('Could not fetch the requested page safely.');
        }
    })(req, res, next);
});

app.listen(PORT, () => {
    console.log(`Proxy navigation server running locally on http://localhost:${PORT}`);
});
