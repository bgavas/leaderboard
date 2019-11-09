const { RESPONSE_STATUS, REDIS_SET } = require('../../../util/constant');
const errors = require('../../../util/error');
const models = require('../../../models');
const { client } = require('./../../../db/redis');

module.exports = (req, res, next) => {

    // Extract user id
    const userId = req.params.userId;

    let user;

    // Find user by id
    return models.user
        .findByPk(userId)
        .then(u => {

            // Set user
            user = u;

            // User not found
            if(!user) return Promise.reject(errors.USER_NOT_FOUND);

            let promises = [];

            // Get score
            promises.push(client.zscoreAsync(REDIS_SET.USERS, user.id));

            // Get rank
            promises.push(client.zrevrankAsync(REDIS_SET.USERS, user.id));

            // Wait promises
            return Promise.all(promises);

        })
        // Success
        .then(([score, rank]) => next({
            data: {
                id: user.id,
                displayName: user.displayName,
                score: parseInt(score),
                rank: parseInt(rank)
            },
            message: `User profile retrieved for ${req.params.userId}`,
            status: RESPONSE_STATUS.SUCCESS
        }))
        // Fail
        .catch(error => next({
            data: error,
            message: `Failed while retrieving user profile by id: ${req.params.userId}`,
            status: RESPONSE_STATUS.FAIL
        }));

};

/**
 * @swagger
 * /api/v1/user/{userId}/profile:
 *   get:
 *     tags:
 *       - User
 *     description: Get user profile
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: path
 *         type: string
 *     responses:
 *       200:
 *         headers:
 *           x-auth:
 *             schema:
 *               type: string
 *             description: Authentication token
 *         schema:
 *           type: object
 *           $ref: '#/definitions/user'
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
