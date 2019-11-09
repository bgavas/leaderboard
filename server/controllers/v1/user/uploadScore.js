const moment = require('moment');
const { RESPONSE_STATUS, REDIS_SET } = require('../../../util/constant');
const errors = require('../../../util/error');
const models = require('../../../models');
const { client } = require('./../../../db/redis');

module.exports = (req, res, next) => {

    // Extract fields
    const userId = req.params.userId;
    const score = req.body.score;

    let user, scoreLog, promises = [];

    // Start transaction
    return models.sequelize
        .transaction(t => {

            // Find user
            return models.user
                .findByPk(userId)
                .then(u => {

                    // Set user
                    user = u;
        
                    // User not found
                    if(!user) return Promise.reject(errors.USER_NOT_FOUND);

                    // Update user score
                    promises.push(
                        models.user.update({ score: user.score + score }, {
                            where: { id: user.id },
                            transaction: t
                        })
                    );

                    // Add score log
                    promises.push(
                        models.scoreLog.create({
                            oldScore: user.score,
                            newScore: user.score + score,
                            score: score,
                            userId: user.id
                        })
                    );

                    // Wait promise results
                    return Promise.all(promises);

                })
                .then(([, sl]) => {

                    // Set score log
                    scoreLog = sl;

                    // Reset promise array
                    promises = [];
                    
                    // Add score to redis
                    promises.push(client.zaddAsync(REDIS_SET.USERS, scoreLog.newScore, user.id));
                    
                    // Add score to redis with country
                    promises.push(client.zaddAsync(user.country, scoreLog.newScore, user.id));

                    // Wait promise results
                    return Promise.all(promises);

                });
                
        })
        // Success
        .then(() => next({
            data: {
                id: scoreLog.id,
                userId: user.id,
                score: score,
                oldScore: scoreLog.oldScore,
                newScore: scoreLog.newScore,
                timestamp: moment(scoreLog.createdAt).unix()
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
 * definition:
 *   uploadScore:
 *     properties:
 *       score:
 *         type: integer
 *     example: {
 *       "score": 100
 *     }
 */

/**
 * @swagger
 * /api/v1/user/{userId}/score:
 *   post:
 *     tags:
 *       - User
 *     description: Upload user score
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: userId
 *         in: path
 *         type: string
 *       - name: uploadScore
 *         in: body
 *         schema:
 *           $ref: '#/definitions/uploadScore'
 *     responses:
 *       200:
 *         headers:
 *           x-auth:
 *             schema:
 *               type: string
 *             description: Authentication token
 *         schema:
 *           type: object
 *           $ref: '#/definitions/scoreLog'
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
