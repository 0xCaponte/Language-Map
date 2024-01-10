import fs from 'fs';
import path from 'path';

/**
 * Logs the specified data to a file in JSON format.
 * @param {Object} data - The data to log.
 */
function logData(data: any) {
	const logFilePath = path.join(process.cwd(), 'logs', 'language-requests.log');
	const logEntry = JSON.stringify(data) + '\n';

	fs.appendFile(logFilePath, logEntry, (err) => {
		if (err) console.error('Logging error:', err);
	});
}
