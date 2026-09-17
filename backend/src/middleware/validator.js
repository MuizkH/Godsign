export const validateRequest = (schema) => {
  return async (req, res, next) => {
    try {
      if (schema.safeParse) {
        // Direct schema validation (assumed to be req.body)
        req.body = await schema.parseAsync(req.body);
      } else {
        // Nested schema validation for body, query, and params
        if (schema.body) {
          req.body = await schema.body.parseAsync(req.body);
        }
        if (schema.query) {
          req.query = await schema.query.parseAsync(req.query);
        }
        if (schema.params) {
          req.params = await schema.params.parseAsync(req.params);
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};
