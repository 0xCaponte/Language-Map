/**
 * @fileoverview Helper Class to format data based on the user's preferences
 */

export class FormatHelper {
	/**
	 * Formats a number based on the users locale
	 *
	 * @param num
	 * @returns
	 */
	public formatNumber(num: number): String {
		let userLocale = typeof navigator !== 'undefined' ? navigator.language : 'en-US';
		return new Intl.NumberFormat(userLocale).format(num);
	}

	/**
	 * Formats a string so that the first letter is upper case and the rest lower case
	 * 
	 * @param text
	 * @returns
	 */
	public capitalize(text: String): String {
		return text.charAt(0).toUpperCase() + text.slice(1);
	}
}
