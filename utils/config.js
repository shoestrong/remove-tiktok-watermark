const { getIPAddress } = require('./help')
const PORT = process.env.PORT || 3030

module.exports = {
	port: PORT,
	downloadUrl: process.env.DEBUG === 'dev' ? `http://${getIPAddress()}:${PORT}` : `${getIPAddress()}`,
	ipAddress: `http://${getIPAddress()}:${PORT}`
};