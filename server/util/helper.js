const defineRoutes = (routes, routeName, version) => {

    // Define router
    const router = require('express').Router();

    // Create all routes
    routes.forEach((endpoint) => {

        // Set version if endpoint doesn't support
        if (!endpoint.versions.includes(version)) version = endpoint.fallbackVersion;

        // Set handlers
        let handlers = [];
        // if (endpoint.userAuthentication) handlers.push(userAuthentication); in a normal environemnt it is used for authentication middleware
        handlers = handlers.concat(endpoint.handlers);

        // Set controller
        router[endpoint.type](endpoint.path, handlers,
            require(`./../controller/${version}/${routeName}/${endpoint.controller}`));

    });

    // Return router
    return router;

};

module.exports = {
    defineRoutes,
};