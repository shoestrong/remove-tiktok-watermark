const { getIPAddress } = require('./help')
const PORT = process.env.PORT || 3030

module.exports = {
	port: PORT,
	downloadUrl: `http://${getIPAddress()}`,
	ipAddress: `http://${getIPAddress()}:${PORT}`
};