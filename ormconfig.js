module.exports = {
    type: "postgres",
    host: process.env.TH_DB_HOST,
    port: process.env.TH_DB_PORT,
    username: process.env.TH_DB_USER,
    password: process.env.TH_DB_PASSWORD,
    database: process.env.TH_DB_NAME,
    synchronize: false,
    logging: false,
    entities: [
       "dist/models/**/*.js"
    ],
    migrations: [
       "dist/migrations/**/*.js"
    ],
    subscribers: [
       "src/subscribers/**/*.ts"
    ],
    cli: {
       entitiesDir: "src/models",
       migrationsDir: "src/migrations",
       subscribersDir: "src/subscribers"
    }
  }
