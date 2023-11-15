/**
 * @fileoverview Helper Class to debounce (delay) the execution of functions
 */

class DebounceHelper {
	private timeout: any;
	private waitTime: number;

	// Constructors
	constructor(waitTime: number = 500) {
		this.waitTime = waitTime;
	}

	/**
	 * Debounced function that delays the call to the passed function until after the waitTime (in milliseconds)
	 * have passed since the last call.
	 *
	 * @param func
	 * @returns
	 */
	debounce(func: (...args: any[]) => void): (...args: any[]) => void {
		return (...args: any[]) => {
			clearTimeout(this.timeout);
			this.timeout = setTimeout(() => func(...args), this.waitTime);
		};
	}
}

export default DebounceHelper;
