const { ENVIRONMENT } = require('./../util/constant');

var env = process.env.NODE_ENV || ENVIRONMENT.DEVELOPMENT;
env = 'production';
process.env.NODE_ENV = env;

var config = require('./config.json');
var envConfig = config[env];

Object.keys(envConfig).forEach((key) => {
	process.env[key] = envConfig[key];
});