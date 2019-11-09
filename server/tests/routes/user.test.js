const fs = require('fs');
const { app } = require('./../../server');
const commonSeed = require('./../seeds/common.seed');
const utilSeed = require('./../util/util');
const testConfig = require('./../../config/test.config');

describe('USER ROUTE', () => {

    beforeEach(utilSeed.resetDb);
    beforeEach(commonSeed.populateTables);

    const filterTests = testConfig.functionFilter.map(item => item + '.js');

    let routePrefix = 'api/v1/user';

    // Read each test file for v1
    fs
        .readdirSync(__dirname + '/../controllers/v1/user')
        .forEach(file => {
            if (filterTests.length === 0 || filterTests.includes(file))
                require(__dirname + '/../controllers/v1/user/' + file)(app, routePrefix);
        });

});