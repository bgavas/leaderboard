const expect = require('expect');
const _ = require('lodash');
const request = require('supertest');
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const { client } = require('../../../../db/redis');
const models = require('../../../../models');
const constants = require('../../../../util/constant');
const errors = require('../../../../util/error');
const commonSeed = require('../../../seeds/common.seed');

module.exports = (app, routePrefix) => {

    describe(`GET/${routePrefix}/user/:userId/score`, () => {

        it('should get user profile', (done) => {

            const user = commonSeed.users[0];
            const score = 30;

            request(app)
                .post(`/${routePrefix}/${user.id}/score`)
                .send({ score })
                .expect(200)
                .end((err, res) => {

                    // Error
                    if(err) return done(err);

                    expect(res.body.id).toBeTruthy();
                    expect(res.body.userId).toBeTruthy();
                    expect(res.body.score).toBeTruthy();
                    expect(res.body.newScore).toBeTruthy();
                    expect(res.body.oldScore).toBeTruthy();

                    // Find score log
                    return models.scoreLog
                        .findOne({
                            where: {
                                id: res.body.id,
                                score,
                                userId: user.id,
                                oldScore: user.score,
                                newScore: user.score + score
                            }
                        })
                        .then(sl => {
                            expect(sl).toBeTruthy();
                            // Check updated user score
                            return models.user.findOne({
                                where: {
                                    id: user.id,
                                    score: user.score + score
                                }
                            });
                        })
                        .then(u => {
                            expect(u).toBeTruthy();
                            // Check user score in redis
                            return client.zscoreAsync(constants.REDIS_SET.USERS, user.id);
                        })
                        .then(s => {
                            expect(parseInt(s)).toBe(user.score + score);
                            // Check user score in redis for country
                            return client.zscoreAsync(user.country, user.id);
                        })
                        .then(s => {
                            expect(parseInt(s)).toBe(user.score + score);
                            done();
                        })
                        // Error
                        .catch(e => done(e));

                });

        });

        it('should not get profile if user not found', (done) => {

            const score = 30;

            request(app)
                .post(`/${routePrefix}/${uuidv4()}/score`)
                .send({ score })
                .expect(400)
                .expect(res => {
                    expect(res.body.code).toBe(errors.USER_NOT_FOUND.code);
                })
                .end(done);

        });

    });

};