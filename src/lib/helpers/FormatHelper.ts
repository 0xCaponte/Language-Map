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
	public formatNumber(num: number): string {
		let userLocale = navigator.language;
		return new Intl.NumberFormat(userLocale).format(num);
	}
}
