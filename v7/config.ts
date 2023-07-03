if (!process.env.CODESPACES) {
	const dotenv = require('dotenv');
	const path = require('path');

	const result = dotenv.config({ path: path.resolve(__dirname, '../.env') });
	if (result.error) {
		console.error(result.error);
		process.exit(1);
	}
	console.log(result.parsed);
}

const config = {
	MONGODB_URI: process.env.MONGODB_URI || '',
};

export { config };
