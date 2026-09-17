import { ZodError } from 'zod';

export const errorHandler = (err, req, res, next) => {
  // If response headers have already been sent, delegate to default express error handler
  if (res.headersSent) {
    return next(err);
  }

  const isProduction = process.env.NODE_ENV === 'production';
  const reqId = req.id || 'none';

  // Log error details with request correlation ID
  console.error(
    `[Error] ID=${reqId} Message=${err.message}${!isProduction && err.stack ? `\nStack: ${err.stack}` : ''}`
  );

  // 1. Zod Validation Error handling
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid request input',
        details: err.issues.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
        requestId: reqId,
      },
    });
  }

  // 2. JWT Authentication / Supabase database errors
  let statusCode = err.statusCode || 500;
  let errorCode = err.code || 'INTERNAL_SERVER_ERROR';
  let message = err.message || 'An unexpected error occurred';

  // Mask database details or Supabase API details
  if (
    err.name?.includes('Postgres') ||
    err.message?.includes('postgres') ||
    err.message?.includes('supabase') ||
    err.code?.startsWith('23') // Postgres constraint codes
  ) {
    message = 'A database operations error occurred';
    errorCode = 'DATABASE_ERROR';
  }

  // Final sanitization for internal 500 errors in production
  if (statusCode === 500) {
    if (isProduction) {
      message = 'An internal server error occurred';
      errorCode = 'INTERNAL_SERVER_ERROR';
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
      requestId: reqId,
      stack: !isProduction && statusCode === 500 ? err.stack : undefined,
    },
  });
};
