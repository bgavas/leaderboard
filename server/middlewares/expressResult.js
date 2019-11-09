const { RESPONSE_STATUS } = require('./../util/constant');
const errors = require('./../util/error');
const logger = require('../util/logger');

let expressResult = (result, req, res, next) => {

	// console.log(result);

	// If headers set before skip
    if (res.headersSent) {
		logger.error("Internal servor error. Error: Headers sent.");
		return res.status(500).send({
			code: errors.INTERNAL_SERVER_ERROR.code,
			message: errors.INTERNAL_SERVER_ERROR.message
		});
	} else if (!result) { // The result didn't come for any reason
		logger.error("Internal servor error. Error: " + result);
		return res.status(500).send({
			code: errors.INTERNAL_SERVER_ERROR.code,
			message: errors.INTERNAL_SERVER_ERROR.message
		});
	}

	const data = result.data;

	// SUCCESS

	// Was it a successful process?
	if (result.status === RESPONSE_STATUS.SUCCESS) {

		// Set headers if exists
		if (result.headers) res.header(result.headers);

		// Log warning
		logger.info(JSON.stringify(result, null, 2));

		// Return success
		return res.status(200).send(data);

	}

	// ERROR

	// Is there error object?
    if (data) {

		// Find the error
		const err = Object.values(errors).find(item => item.code === data.code);
		let returnObject;

		// Known error
		if (err) returnObject = { code: err.code, message: err.message };
		// Unknown error
		else returnObject = { code: errors.UNKNOWN_ERROR.code, message: errors.UNKNOWN_ERROR.message };

		// Log warning
		logger.warn((result.data.stack ? result.data.stack : '') + '\n' + JSON.stringify(returnObject, null, 2));

		// Error
		return res.status(400).send(returnObject);

    } else {

		// Unknown error
		let returnObject = { code: errors.INTERNAL_SERVER_ERROR.code, message: errors.INTERNAL_SERVER_ERROR.message };

		// Log error
		logger.error(result.stack + '\n' + JSON.stringify(returnObject, null, 2));

		// Multer error
		return res.status(500).send(returnObject);

	}

};

// Export
module.exports = { expressResult };
