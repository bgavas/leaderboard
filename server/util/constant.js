module.exports = {

    AVAILABLE_VERSIONS: ['v1'], // Available REST service versions
    AVAILABLE_COUNTRIES: ['tr', 'us', 'it', 'fr', 'de', 'nl'],

    REDIS_SET: {
        USERS: 'users'
    },

    ENVIRONMENT: {
        TEST: 'test',
        DEVELOPMENT: 'development',
        PRODUCTION: 'production'
    },

    RESPONSE_STATUS: {
        FAIL: 'Fail',
        SUCCESS: 'Success',
        AUTHENTICATION_FAILED: 'Authentication fail'
    },

};
