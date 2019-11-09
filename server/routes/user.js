const { defineRoutes } = require('./../util/helper');

// Define routes
const routes = [{
    controller: 'populate',
    description: 'Populate table with random users',
    fallbackVersion: 'v1',
    handlers: [],
    path: '/populate',
    type: 'post',
    versions: ['v1']
}, {
    controller: 'getProfile',
    description: 'Get user profile',
    fallbackVersion: 'v1',
    handlers: [],
    path: '/:userId/profile',
    type: 'get',
    versions: ['v1']
}, {
    controller: 'uploadScore',
    description: 'Upload score',
    fallbackVersion: 'v1',
    handlers: [],
    path: '/:userId/score',
    type: 'post',
    versions: ['v1']
}];

// Export route
module.exports = (version) => defineRoutes(routes, 'user', version);
