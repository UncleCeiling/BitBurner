// Variables

const CONSTANT = 1234; // Define
export { CONSTANT }; // Export

// Classes

/** Example Class */
export class FooBar {
  #ns;
  /** @param {NS} ns Important - don't forget it. */
  constructor(ns) {
    this.#ns = ns;
  }
  get message() {
    return "FooBar";
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
  let message = `${foo}bar`;
  ns.print(message);
  return message;
}

// Main

/** @param {NS} ns  */
export async function main(ns) {
  let message = "";
  message = message.concat(`const: ${CONSTANT}\n`);
  message = message.concat(`class: ${new FooBar(ns).message}\n`);
  message = message.concat(`function: ${function_name(ns, "foo")}`);
  ns.alert(message);
}
