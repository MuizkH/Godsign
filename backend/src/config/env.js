import dotenv from 'dotenv';
import { z } from 'zod';

// Ensure env variables are loaded
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().default(5000),
  CLIENT_URL: z.string().url('CLIENT_URL must be a valid URL'),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_PUBLISHABLE_KEY: z.string().min(1, 'SUPABASE_PUBLISHABLE_KEY is required'),
  SUPABASE_SECRET_KEY: z.string().min(1, 'SUPABASE_SECRET_KEY is required'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

const validateEnv = () => {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('❌ Startup Failed: Invalid backend environment configuration.');
    result.error.issues.forEach((issue) => {
      console.error(`   - Parameter [${issue.path.join('.')}]: ${issue.message}`);
    });
    process.exit(1);
  }

  return result.data;
};

const env = validateEnv();

export default env;
