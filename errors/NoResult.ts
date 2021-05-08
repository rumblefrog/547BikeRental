export default class NoResult extends Error {

    /**
     * No result constructor
     * 
     * @param message Error message
     */
    constructor(message?: string) {
        super(message);

        Object.setPrototypeOf(this, NoResult.prototype);
    }
}