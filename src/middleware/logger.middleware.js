export const requestLogger = (req, res, next) => {
    const timestamp = new Date().toISOString();
    const { method, originalUrl, ip, body } = req;
    
    console.log(`[${timestamp}] ${method} ${originalUrl} - IP: ${ip}`);
    
    // Log request body if present (but skip sensitive data)
    if (Object.keys(body).length > 0) {
        const sanitizedBody = { ...body };
        // Remove sensitive fields if they exist
        delete sanitizedBody.password;
        delete sanitizedBody.token;
        console.log('Request Body:', JSON.stringify(sanitizedBody));
    }

    // Capture response data
    const originalSend = res.send;
    res.send = function (data) {
        console.log(`Response Status: ${res.statusCode}`);
        // Log response time
        console.log('-------------------\n');
        originalSend.apply(res, arguments);
    };

    next();
};
