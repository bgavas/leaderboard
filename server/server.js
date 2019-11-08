const { AVAILABLE_VERSIONS, EXPOSED_HEADERS, ENVIRONMENT, TIMEOUT } = require('./util/constant');

// Get environment configuration
require('./config/config.js');
// Init helper functions
require('./util/helper');
// Connect to db
require('./db/connectDb');

const express = require('express');
const bodyParser = require('body-parser');
const initializeSwagger = require('./util/swagger');

const app = express();
const port = process.env.PORT;

// App middleware
app.use(bodyParser.json());

// Initialize swagger
initializeSwagger(app);

// Start server
app.listen(port, () => {
    console.log(`App started on port ${port}`);
});

// Export for testing
module.exports = { app };