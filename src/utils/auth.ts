export const checkAuth = (cookie: any, dateToCheck?: string) => {
	let isAuthenticated = false;
	let isDateLocked = null;
	let lockDate = null;
	let authLevel = 0;

	// Check against validation token
	const validLevel1 = import.meta.env.AUTH_VALIDATION_1;
	const validLevel2 = import.meta.env.AUTH_VALIDATION_2;

	if (cookie) {
		isAuthenticated =
			cookie.value === validLevel1 || cookie.value === validLevel2;
	}

	// Determine level of authorisation
	if (isAuthenticated) {
		authLevel = cookie.value === validLevel1 ? 1 : 2;
	}

	// Check date
	if (dateToCheck) {
		const today = new Date();
		lockDate = new Date(today.setMonth(today.getMonth() - 3));
		isDateLocked = new Date(dateToCheck) > lockDate;

		if (!isDateLocked && !isAuthenticated) {
			authLevel = 1;
		}
	}

	return { isAuthenticated, authLevel, isDateLocked, lockDate };
};
