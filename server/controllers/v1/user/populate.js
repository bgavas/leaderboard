const _ = require('lodash');
const randomstring = require('randomstring');
const { RESPONSE_STATUS, AVAILABLE_COUNTRIES, REDIS_SET } = require('./../../../util/constant');
const models = require('./../../../models');
const { client } = require('./../../../db/redis');

module.exports = (req, res, next) => {

    // Async function
    (async function f() {

        // Get user count to be created
        const count = req.body.count;
        let addedCount = 0;

        const addUser = (displayName, country) => {
            // Start transaction
            return models.sequelize.transaction(t => {

                // Random score
                const score = Math.floor(Math.random() * Math.floor(10000));
                            
                // Add user to database
                return models.user.create({
                        displayName,
                        country,
                        score
                    },{ transaction: t })
                    .then(user => {

                        let promises = [];
                        
                        // Add user to redis
                        promises.push(client.zaddAsync(REDIS_SET.USERS, score, user.id));
                        
                        // Add user to redis with country
                        promises.push(client.zaddAsync(country, score, user.id));

                        // Wait promises
                        return Promise.all(promises);
                    
                    })
                    // Increment add count
                    .then(() => addedCount++);
                    
            })
            .catch(e => console.log('Add user error:', e));
        }

        // Iterate
        for (let i = 0; i < count; i++) {
    
            // Generate random display name
            const displayName = randomstring.generate();
        
            // Get random country code
            const countryIndex = Math.floor(Math.random() * Math.floor(AVAILABLE_COUNTRIES.length));
            const country = AVAILABLE_COUNTRIES[countryIndex];
    
            // Add user
            await addUser(displayName, country);
    
        }

        // Return success
        return next({
            data: {},
            message: `User table populated succesfully by ${addedCount}`,
            status: RESPONSE_STATUS.SUCCESS
        });

    })();

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