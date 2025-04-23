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
  DATABASE_URL: Joi.string().required(),

  // Client Configuration
  CLIENT_URL: Joi.string().uri().required(),

  // Recipe Repository Server
  RECIPE_REPOSITORY_SERVER_USERNAME: Joi.string(),
  RECIPE_REPOSITORY_SERVER_PASSWORD: Joi.string(),
  RECIPE_REPOSITORY_SERVER_URI: Joi.string(),
  RECIPE_REPOSITORY_SERVER_MOUNT_POINT: Joi.string(),
});
