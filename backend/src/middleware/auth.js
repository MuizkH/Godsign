import { supabaseAdmin } from '../config/supabase.js';

// Protect routes - Verify Supabase JWT & fetch profile
export const protect = async (req, res, next) => {
  let token;

  // Retrieve token from Authorization header (Bearer token)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    const error = new Error('Not authorized to access this route, token missing');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    return next(error);
  }

  try {
    // Verify token using Supabase admin SDK
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      const error = new Error('Not authorized to access this route, invalid session');
      error.statusCode = 401;
      error.code = 'UNAUTHORIZED';
      return next(error);
    }

    // Query profiles table in Postgres to retrieve user RBAC role/department
    const { data: profile, error: dbError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (dbError || !profile) {
      const error = new Error('User profile does not exist');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      return next(error);
    }

    if (!profile.is_active) {
      const error = new Error('User account is deactivated');
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      return next(error);
    }

    // Attach user profile to req.user (mapping DB null values to frontend 'none')
    req.user = {
      id: user.id,
      email: user.email,
      name: profile.name,
      role: profile.role,
      department: profile.department || 'none',
      isActive: profile.is_active,
    };

    next();
  } catch (err) {
    const error = new Error('Not authorized to access this route');
    error.statusCode = 401;
    error.code = 'UNAUTHORIZED';
    return next(error);
  }
};

// Grant access to specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      const error = new Error(`User role '${req.user?.role || 'none'}' is not authorized to access this route`);
      error.statusCode = 403;
      error.code = 'FORBIDDEN';
      return next(error);
    }
    next();
  };
};
