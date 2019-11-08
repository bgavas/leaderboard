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
}];


// Export route
module.exports = (version) => defineRoutes(routes, 'user', version);
