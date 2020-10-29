const { getIPAddress } = require('./help')
const PORT = process.env.PORT || 3030

module.exports = {
	port: PORT,
	ipAddress: `http://${getIPAddress()}:${PORT}`
};