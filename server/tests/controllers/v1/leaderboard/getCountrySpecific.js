const expect = require('expect');
const _ = require('lodash');
const request = require('supertest');
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const models = require('../../../../models');
const errors = require('../../../../util/error');
const constants = require('../../../../util/constant');
const commonSeed = require('../../../seeds/common.seed');

module.exports = (app, routePrefix) => {

    describe(`GET/${routePrefix}/:countryCode`, () => {

        it('should get leaderboard for country tr', (done) => {

            request(app)
                .get(`/${routePrefix}/${constants.AVAILABLE_COUNTRIES[0]}`)
                .expect(200)
                .expect(res => {

                    const users = commonSeed.users
                        .filter(u => u.country === constants.AVAILABLE_COUNTRIES[0])
                        .slice(0)
                        .sort((a, b) => b.score - a.score);

                    // Get expected size
                    const expectedSize = users.length > constants.PAGINATION.DEFAULT_SIZE ?
                        constants.PAGINATION.DEFAULT_SIZE : users.length;

                    // Check size
                    expect(res.body.length).toBe(expectedSize);

                    // Check order
                    res.body
                        .slice(0)
                        .sort((a, b) => b.score - a.score)
                        .forEach((u, index) => {
                            expect(u.id).toBe(users[index].id);
                        });
                    
                })
                .end(done);

        });

        it('should get leaderboard for country tr with page and size', (done) => {

            request(app)
                .get(`/${routePrefix}/${constants.AVAILABLE_COUNTRIES[0]}?page=1&size=1`)
                .expect(200)
                .expect(res => {

                    // Get filtered users
                    const users = commonSeed.users
                        .filter(u => u.country === constants.AVAILABLE_COUNTRIES[0])
                        .slice(0)
                        .sort((a, b) => b.score - a.score);

                    // Check size
                    expect(res.body.length).toBe(1);

                    // Check order
                    users
                        .slice(1, 2)
                        .forEach((u, index) => {
                            expect(u.id).toBe(res.body[index].id);
                        });
                    
                })
                .end(done);

        });

        it('should not get leaderboard if country code not found', (done) => {

            request(app)
                .get(`/${routePrefix}/incorrect-country-code`)
                .expect(400)
                .expect(res => {
                    expect(res.body.code).toBe(errors.COUNTRY_CODE_NOT_FOUND.code);
                })
                .end(done);

        });

    });

};