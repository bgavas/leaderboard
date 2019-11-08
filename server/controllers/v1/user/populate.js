const _ = require('lodash');
const { RESPONSE_STATUS } = require('./../../../util/constant');
const models = require('./../../../models');

module.exports = (req, res, next) => {

};

/**
 * @swagger
 * definition:
 *   populateUser:
 *     properties:
 *       count:
 *         type: integer
 *     example: {
 *       "count": 10000
 *     }
 */

/**
 * @swagger
 *  /api/v1/user/populate:
 *   post:
 *     tags:
 *       - User
 *     description: Populate user table with random users
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: populateUser
 *         in: body
 *         schema:
 *           $ref: '#/definitions/populateUser'
 *     responses:
 *       200:
 *         headers:
 *           x-auth:
 *             schema:
 *               type: string
 *             description: Authentication token
 *         schema:
 *           type: object
 *       400:
 *         description:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/error'
 *       500:
 *         description:
 *         schema:
 *           type: object
 *           $ref: '#/definitions/error'
 */