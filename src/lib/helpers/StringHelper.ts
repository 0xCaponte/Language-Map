/**
 * @fileoverview Helper Class to format data based on the user's preferences
 */

export class StringHelper {
	/**
	 * Formats a number based on the users locale
	 *
	 * @param num
	 * @returns
	 */
	public formatNumber(num: number): string {
		let userLocale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
		let roundedNum = Math.round(num);
		return new Intl.NumberFormat(userLocale).format(roundedNum);
	}

	/**
	 * Formats a percentage number based on the users locale.
	 * Numbers rounded to 0 will have a decimal point
	 *
	 * @param num
	 * @returns
	 */
	public formatPercentageNumber(percentageNumber: number): string {
		let userLocale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
		let roundedNumber: number;

		//
		if (percentageNumber < 0.5 && percentageNumber !== 0) {
			// Round up to the next one decimal place (e.g., 0.01 to 0.1)
			roundedNumber = Math.ceil(percentageNumber * 10) / 10;
			return new Intl.NumberFormat(userLocale, {
				minimumFractionDigits: 1,
				maximumFractionDigits: 1
			}).format(roundedNumber);
		} else {
			return this.formatNumber(percentageNumber);
		}
	}

	/**
	 * Formats a string so that the first letter is upper case and the rest lower case
	 *
	 * @param text
	 * @returns
	 */
	public capitalize(text: string): string {
		return text.charAt(0).toUpperCase() + text.slice(1);
	}

	/**
	 * Replaces a given substring with the new value in the original one.
	 *
	 * @param original
	 * @param toReplace
	 * @param newValue
	 * @returns
	 */
	public replaceSubString(original: string, toReplace: string, newValue: string): string {
		const lastIndex = original.toLowerCase().lastIndexOf(toReplace.toLowerCase());

		if (lastIndex > -1) {
			original =
				original.substring(0, lastIndex) +
				newValue +
				original.substring(lastIndex + toReplace.length);
		}

		return original;
	}
}
