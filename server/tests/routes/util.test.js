const { app } = require('./../../server');
const testConfig = require('./../../config/test.config');
const models = require('./../../models');

describe('UTIL', () => {

    // Sync db (force)
    if (testConfig.forceDatabase) {

        describe(`reset tables`, () => {
    
            it('should reset tables', (done) => {

                setTimeout(() => {
                    models.sequelize.sync({ force: true }).then(() => done())
                }, 500);
    
            });
    
        });

    }
    // Sync db
    else {

        describe(`sync tables`, () => {
    
            it('should sync tables', (done) => {
    
                setTimeout(() => {
                    models.sequelize.sync({ alter: true }).then(() => done())
                }, 500);
    
            });
    
        });

    }
    
});