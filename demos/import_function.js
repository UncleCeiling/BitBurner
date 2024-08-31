// ===============================
// === All Functions in a file ===
// ===============================
//
// Import everything (*) from the file to a namespace called 'Custom'
//
//				Namespace							File
//		All			||								 ||
//		 |      \/								 \/
import * as Custom from 'demos/my_function.js'
//
/** @param {NS} ns */
export async function main(ns) {
    ns.tail(); ns.disableLog('ALL')
    //        Namespace   Function   Arguments                           
    //              \/       \/       \/
    let message = Custom.an_example('Peepee Poopoo')
    ns.print(message)
}

// ====================================
// === Specific Functions in a file ===
// ====================================
//
// If you just want to import 1 function, you can specify it like this:
// 
// 			 Function									 File
//					\/ 											\/
// import { an_example } from 'demos/my_function.js'
//
/** @param {NS} ns */
// export async function main(ns) {
// 	ns.tail(); ns.disableLog('ALL')
// 	//             Function      Arguments                           
// 	//                \/            \/
// 	let message = an_example('Peepee Poopoo')
// 	ns.print(message)
// }