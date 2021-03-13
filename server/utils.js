const jwt = require('jsonwebtoken');
const APP_SECRET = 'WebPolice';

function getTokenPayload(token) {
	return jwt.verify(token, APP_SECRET);
}

function getUserId(req) {
	if (req) {
		const authHeader = req.headers.authorization;
		if (authHeader) {
			const token = authHeader.replace('Bearer ', '');
			if (!token) throw new Error('No token found');

			const { userId } = getTokenPayload(token);
			return userId;
		}
	}

	throw new Error('Not authenticated');
}
function getAdminId(req) {
	if (req) {
		const authHeader = req.headers.authorization;
		if (authHeader) {
			const token = authHeader.replace('Bearer ', '');
			if (!token) throw new Error('No token found');

			const { adminId } = getTokenPayload(token);
			return adminId;
		}
	}

	throw new Error('Not authenticated');
}

module.exports = {
	APP_SECRET,
	getUserId,
	getAdminId
};
