export const getRequiredEnv = (name: string): string => {
	const value = process.env[name];

	if (value === undefined || value.length === 0) {
		throw new Error(`Required environment variable "${name}" is not set.`);
	}

	return value;
};