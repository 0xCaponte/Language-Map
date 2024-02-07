/**
 * @fileoverview Helper Class for various set operations
 */

export class SetHelper {
    
	/**
	 * Checks if two sets of strings have the same size and elements.
	 *
	 * @param setA
	 * @param setB
	 */
	public areSetsEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
		if (setA.size !== setB.size) return false;
		for (let a of setA) if (!setB.has(a)) return false;
		return true;
	}

    /**
     * Compares two sets and return the elements of the setA that are not present in the setB
     * 
     * @param setA 
     * @param setB 
     */
    public difference<T>(setA: Set<T>, setB: Set<T>): Set<T> {
        let differenceSet = new Set<T>(setA);
        for (let elem of setB) {
            differenceSet.delete(elem);
        }
        return differenceSet;
    }
		
}
