const moment = require('moment');
const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const models = require('./../../models');
const { client } = require('./../../db/redis');
const { AVAILABLE_COUNTRIES, REDIS_SET } = require('./../../util/constant');

const users = [{
    id: uuidv4(),
    displayName: 'name0',
    score: 14,
    country: AVAILABLE_COUNTRIES[0]
}, {
    id: uuidv4(),
    displayName: 'name1',
    score: 11,
    country: AVAILABLE_COUNTRIES[0]
}, {
    id: uuidv4(),
    displayName: 'name2',
    score: 13,
    country: AVAILABLE_COUNTRIES[0]
}, {
    id: uuidv4(),
    displayName: 'name3',
    score: 15,
    country: AVAILABLE_COUNTRIES[1]
}, {
    id: uuidv4(),
    displayName: 'name4',
    score: 12,
    country: AVAILABLE_COUNTRIES[2]
}];

const populateTables = (done) => {
    // Populate user table
    models.user.bulkCreate(users)
        // Populate user in redis
        .then(() => client.zadd(REDIS_SET.USERS,
            users[0].score, users[0].id, users[1].score, users[1].id,
            users[2].score, users[2].id, users[3].score, users[3].id,
            users[4].score, users[4].id)
        )
        // Populate AVAILABLE_COUNTRIES[0] in redis
        .then(() => client.zadd(AVAILABLE_COUNTRIES[0],
            users[0].score, users[0].id, users[1].score, users[1].id,
            users[2].score, users[2].id)
        )
        // Populate AVAILABLE_COUNTRIES[1] in redis
        .then(() => client.zadd(AVAILABLE_COUNTRIES[1],
            users[3].score, users[3].id)
        )
        // Populate AVAILABLE_COUNTRIES[2] in redis
        .then(() => client.zadd(AVAILABLE_COUNTRIES[2],
            users[4].score, users[4].id)
        )
        .then(() => done());
};

module.exports = {
    populateTables,
    users,
};