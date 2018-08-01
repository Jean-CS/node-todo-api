const env = process.env.NODE_ENV || "development"; // sets to production or test... if not any of these two, set it to "development"

if (env === 'development' || env === 'test') {
  const config = require('./config.json');
  const envConfig = config[env]; // either 'development' or 'test'

  Object.keys(envConfig).forEach((key) => {
    process.env[key] = envConfig[key];
  });
}