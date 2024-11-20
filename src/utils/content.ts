// ***************************************
//
//   Format Journal Content
//
// ***************************************

export const formatContent = (raw: string, type: string, data?: any) => {
	switch (type) {
		case "journal":
			let formatted: string | string[] | any = raw;

			if (data) {
				// Split into array
				formatted = formatted.replaceAll("]]", "[[");
				formatted = formatted.replaceAll("<p>[[ ", "[[");
				formatted = formatted.replaceAll(" [[</p>", "[[");
				formatted = formatted.split("[[");

				// Track references/footnotes across blocks
				let refCount = 0;

				// Loop through array and convert to data objects
				let ateCount = -1;
				let drankCount = -1;
				let checkinCount = -1;
				formatted = formatted.map((item: string) => {
					if (item.match(/^</)) {
						// Handle footnotes
						item = item.replaceAll(/<sup>\[\d+\]<\/sup>/g, () => {
							refCount++;
							return `<sup id="reference${refCount}"><a href="#footnote${refCount}">[${refCount}]</a></sup>`;
						});

						return {
							type: "copy",
							data: item,
						};
					} else {
						const dataCheck = item.replace(/\s/g, "").split("|");

						// TODO: Add ability to use either provided index or inc. counts
						// TODO: Remove dataCheck[0] once all Journal entries are standardised
						switch (dataCheck[0] || item) {
							case "ate":
								ateCount++;
								return {
									type: "ate",
									data: data.checkins.ate[ateCount],
								};
							case "attended":
								checkinCount++;
								return {
									type: "event",
									data: data.checkins.events[checkinCount],
								};
							case "drank":
								drankCount++;
								return {
									type: "drank",
									data: data.checkins.drank[drankCount],
								};
							case "travelled":
							case "traveled":
								checkinCount++;
								return {
									type: "travel",
									data: data.checkins.travels[checkinCount],
								};
							case "visited":
								checkinCount++;
								return {
									type: "visit",
									data: data.checkins.visits[checkinCount],
								};
							default:
								if (!item || item.length < 1 || item === " ") {
									return;
								}

								return {
									type: "unknown",
									data: item,
								};
						}
					}
				});
			}

			// Remove any empty cells
			formatted = formatted.filter((el: any) => el);

			return formatted[0] ? formatted : [formatted];
		default:
			return raw;
	}
};

// ***************************************
//
//   Sort Entries By Month
//
// ***************************************

export const sortByMonth = (data: any) => {
	const groupedData: { [key: string]: any[] } = {};

	for (const item of data) {
		const month = item.date.monthName;

		if (!groupedData[month]) {
			groupedData[month] = [];
		}
		groupedData[month].push(item);
	}

	return Object.values(groupedData);
};

// ***************************************
//
//   Star Rating
//
// ***************************************

export const getStarRating = (number: number, maximum = 5) => {
	let rating = "";

	for (let i = 1; i <= maximum; i++) {
		if (i <= number) {
			rating += "★";
		} else {
			rating += "☆";
		}
	}

	return rating;
};
