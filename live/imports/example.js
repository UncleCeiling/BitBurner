// Variables

const CONSTANT = 1234; // Define
export { CONSTANT }; // Export

// Classes

/** Example Class */
export class FooBar {
  /** @param {NS} ns Important - don't forget it. */
  constructor(ns) {
    this.ns = ns;
    this.message = "FooBar";
  }
  /** @returns {Number} values */
  get message_length() {
    return this.message.length;
  }
}

// Functions

/** Exports a function for use in another location
 * @param {NS} ns Make sure to include the netscript scope.
 * @param {String} foo Any arguments you need
 * @returns {String} Returns what you want
 */
export function function_name(ns, foo) {
  message = `${foo}bar`;
  ns.print(message);
  return message;
}
