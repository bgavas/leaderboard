const models = require('./../../models');
const { client } = require('./../../db/redis');

const resetDb = () => {
    return Promise.resolve()
        .then(() => client.selectAsync(1))
        .then(() => client.flushdbAsync())
        .then(() => models.scoreLog.destroy({ where: {}, force: true }))
        .then(() => models.user.destroy({ where: {}, force: true }));
};

module.exports = {
    resetDb
};