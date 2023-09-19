



export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV,
  dbuser: process.env.DB_USER,
  dbpassword: process.env.DB_PASSWORD,
  dbname: process.env.DB_NAME,
  port: process.env.PORT,
  dbport: process.env.DB_PORT,
  dbhost: process.env.DB_HOST,
})