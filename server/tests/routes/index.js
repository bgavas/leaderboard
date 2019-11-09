const fs = require('fs');
const path = require('path');
const testConfig = require('./../../config/test.config');

var routes = {};
var basename  = path.basename(__filename);

const filterRoutes = testConfig.routeFilter.map(item => item + '.test.js');

require('./util.test.js');

// Read each route
fs
	.readdirSync(__dirname)
	.filter(file => {
		return file !== basename && (filterRoutes.length === 0 || filterRoutes.includes(file));
	})
	.forEach(file => require('./' + file));

module.exports = routes;