const { defineRoutes } = require('./../util/helper');

// Define routes
const routes = [{
    controller: 'get',
    description: 'Get international leaderboard',
    fallbackVersion: 'v1',
    handlers: [],
    path: '/',
    type: 'get',
    versions: ['v1']
}, {
    controller: 'getCountrySpecific',
    description: 'Get leaderboard of a country',
    fallbackVersion: 'v1',
    handlers: [],
    path: '/:countryCode',
    type: 'get',
    versions: ['v1']
}];

// Export route
module.exports = (version) => defineRoutes(routes, 'leaderboard', version);
