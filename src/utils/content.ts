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

						// TODO: Add drank once I can meaningfully extract that data
						switch (dataCheck[0]) {
							case "ate":
								return {
									type: "ate",
									data: data.food[Number(dataCheck[1]) - 1],
								};
							case "attended":
								return {
									type: "event",
									data: data.checkins[Number(dataCheck[1]) - 1],
								};
							case "drank":
								return {
									type: "drank",
									data: data.food[Number(dataCheck[1]) - 1],
								};
							case "travelled" || "traveled":
								return {
									type: "travel",
									data: data.checkins[Number(dataCheck[1]) - 1],
								};
							case "visited":
								return {
									type: "visit",
									data: data.checkins[Number(dataCheck[1]) - 1],
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
