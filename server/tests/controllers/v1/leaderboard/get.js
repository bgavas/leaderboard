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

    describe(`GET/${routePrefix}/user/:userId/profile`, () => {

        it('should get leaderboard', (done) => {

            request(app)
                .get(`/${routePrefix}`)
                .expect(200)
                .expect(res => {

                    // Get expected size
                    const expectedSize = commonSeed.users.length > constants.PAGINATION.DEFAULT_SIZE ?
                        constants.PAGINATION.DEFAULT_SIZE : commonSeed.users.length;

                    // Check size
                    expect(res.body.length).toBe(expectedSize);

                    // Check order
                    commonSeed.users
                        .slice(0)
                        .sort((a, b) => b.score - a.score)
                        .forEach((u, index) => {
                            expect(u.id).toBe(res.body[index].id);
                        });
                    
                })
                .end(done);

        });

        it('should get leaderboard with page and size', (done) => {

            request(app)
                .get(`/${routePrefix}?page=1&size=1`)
                .expect(200)
                .expect(res => {

                    // Check size
                    expect(res.body.length).toBe(1);

                    // Check order
                    commonSeed.users
                        .slice(0)
                        .sort((a, b) => b.score - a.score)
                        .slice(1, 2)
                        .forEach((u, index) => {
                            expect(u.id).toBe(res.body[index].id);
                        });
                    
                })
                .end(done);

        });

    });

};