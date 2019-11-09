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
    score: 12,
    country: AVAILABLE_COUNTRIES[0]
}, {
    id: uuidv4(),
    displayName: 'name3',
    score: 15,
    country: AVAILABLE_COUNTRIES[1]
}];

const populateTables = (done) => {
    models.user.bulkCreate(users)
        .then(() => client.zadd(REDIS_SET.USERS,
            users[0].score, users[0].id, users[1].score, users[1].id,
            users[2].score, users[2].id, users[3].score, users[3].id)
        )
        .then(() => client.zadd(AVAILABLE_COUNTRIES[0],
            users[0].score, users[0].id, users[1].score, users[1].id,
            users[2].score, users[2].id)
        )
        .then(() => client.zadd(AVAILABLE_COUNTRIES[1],
            users[3].score, users[3].id)
        )
        .then(() => done());
};

module.exports = {
    populateTables,
    users,
};