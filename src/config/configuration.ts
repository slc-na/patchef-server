export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  server: {
    host: process.env.SERVER_HOST || '0.0.0.0',
    port: parseInt(process.env.SERVER_PORT, 10) || 6970,
  },
  postgres: {
    user: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'postgres',
    db: process.env.POSTGRES_DB || 'patchef',
  },
  client: {
    url: process.env.CLIENT_URL,
  },
  recipeRepository: {
    serverUri:
      process.env.RECIPE_REPOSITORY_SERVER_URI,
  },
});
