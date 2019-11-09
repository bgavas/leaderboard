const expect = require('expect');
const _ = require('lodash');
const request = require('supertest');
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const models = require('../../../../models');
const errors = require('../../../../util/error');
const commonSeed = require('../../../seeds/common.seed');

module.exports = (app, routePrefix) => {

    describe(`GET/${routePrefix}/user/:userId/profile`, () => {

        it('should get user profile', (done) => {

            const user = commonSeed.users[0];

            request(app)
                .get(`/${routePrefix}/${user.id}/profile`)
                .expect(200)
                .expect(res => {
                    expect(res.body.id).toBe(user.id);
                    expect(res.body.displayName).toBe(user.displayName);
                    expect(res.body.points).toBe(user.score);
                    expect(res.body.rank).toBe(
                        commonSeed.users.slice(0).sort((a, b) => b.score - a.score)
                            .findIndex(u => u.id === user.id)
                    );
                })
                .end(done);

        });

        it('should not get profile if user not found', (done) => {

            request(app)
                .get(`/${routePrefix}/${uuidv4()}/profile`)
                .expect(400)
                .expect(res => {
                    expect(res.body.code).toBe(errors.USER_NOT_FOUND.code);
                })
                .end(done);

        });

    });

};