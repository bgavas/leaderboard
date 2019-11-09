const _ = require('lodash');
const { RESPONSE_STATUS, REDIS_SET, PAGINATION } = require('../../../util/constant');
const errors = require('../../../util/error');
const models = require('../../../models');
const { client } = require('./../../../db/redis');

module.exports = (req, res, next) => {

    // Extract pagination fields
    const page = parseInt(req.query.page) || PAGINATION.DEFAULT_PAGE;
    const size = parseInt(req.query.size) || PAGINATION.DEFAULT_SIZE;

    // Set min and max
    const min = page * size;
    const max = (page + 1) * size - 1;

    let userIds;

    // Find ticket
    return client
        .zrevrangeAsync(REDIS_SET.USERS, min, max)
        .then(uIds => {

            // Set userIds
            userIds = uIds;

            // Get selected users from database
            return models.user.findAll({
                where: {
                    id: userIds
                }
            });

        })
        .then(users => {

            // Adjust response
            return users
                .map(u => ({
                    id: u.id,
                    displayName: u.displayName,
                    score: u.score,
                    rank: (page * size) + 1 + userIds.findIndex(id => id === u.id),
                    country: u.country
                }))
                .sort((a, b) => a.rank - b.rank);

        })
        // Success
        .then(users => next({
            data: users,
            message: `Leaderboard retrieved`,
            status: RESPONSE_STATUS.SUCCESS
        }))
        // Fail
        .catch(error => next({
            data: error,
            message: `Failed while retrieving leaderboard`,
            status: RESPONSE_STATUS.FAIL
        }));

};

/**
 * @swagger
 * /api/v1/leaderboard:
 *   get:
 *     tags:
 *       - Leaderboard
 *     description: Get leaderboard
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: page
 *         in: query
 *         type: integer
 *       - name: size
 *         in: query
 *         type: integer
 *     responses:
 *       200:
 *         headers:
 *           x-auth:
 *             schema:
 *               type: string
 *             description: Authentication token
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             $ref: '#/definitions/leaderboard'
 *       400:
 *         description: Code = 3000
 *         schema:
 *           type: object
 *           $ref: '#/definitions/error'
 *       500:
 *         description: Code = 4000
 *         schema:
 *           type: object
 *           $ref: '#/definitions/error'
 */
