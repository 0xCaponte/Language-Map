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
