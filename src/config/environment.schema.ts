import Joi from 'joi';

export const environmentSchema = Joi.object({
  // Node Environment Mode
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),

  // Server Configuration
  SERVER_HOST: Joi.string().hostname().default('localhost'),
  SERVER_PORT: Joi.number().port().default(6970),

  // Postgres Configuration
  POSTGRES_USER: Joi.string().default('postgres'),
  POSTGRES_PASSWORD: Joi.string().default('postgres'),
  POSTGRES_DB: Joi.string().default('patchef'),

  // Prisma Configuration
  DATABASE_URL: Joi.string().uri(),

  // Client Configuration
  CLIENT_URL: Joi.string().uri(),
});
