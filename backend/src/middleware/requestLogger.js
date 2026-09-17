import crypto from 'crypto';

// Helper to recursively mask sensitive fields in objects
const maskSensitiveData = (data) => {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const masked = Array.isArray(data) ? [...data] : { ...data };
  const sensitiveFields = ['password', 'token', 'access_token', 'refresh_token', 'secret', 'key', 'password123'];

  for (const key in masked) {
    if (sensitiveFields.includes(key.toLowerCase())) {
      masked[key] = '********';
    } else if (typeof masked[key] === 'object' && masked[key] !== null) {
      masked[key] = maskSensitiveData(masked[key]);
    }
  }

  return masked;
};

// Middleware to assign a unique ID to every request
export const requestId = (req, res, next) => {
  const reqId = req.headers['x-request-id'] || crypto.randomUUID();
  req.id = reqId;
  res.setHeader('X-Request-ID', reqId);
  next();
};

// Middleware to log HTTP request execution
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  const maskedBody = maskSensitiveData(req.body);
  const maskedQuery = maskSensitiveData(req.query);

  // Log incoming request with safe masked data
  console.log(
    `[Request] ID=${req.id} Method=${req.method} Path=${req.path} IP=${req.ip} Query=${JSON.stringify(maskedQuery)} Body=${JSON.stringify(maskedBody)}`
  );

  // Intercept response finish to log details
  res.on('finish', () => {
    const duration = Date.now() - start;
    const userId = req.user ? req.user.id : 'anonymous';
    console.log(
      `[Response] ID=${req.id} Method=${req.method} Path=${req.path} Status=${res.statusCode} User=${userId} Duration=${duration}ms`
    );
  });

  next();
};
