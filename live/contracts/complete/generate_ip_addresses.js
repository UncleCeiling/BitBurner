// Given the following string containing only digits, return
// an array with all possible valid IP address combinations
// that can be created from the string:
//
// Note that an octet cannot begin with a '0' unless the number
// itself is exactly '0'. For example, '192.168.010.1' is not a valid IP.
// Examples:
// 25525511135 -> ["255.255.11.135", "255.255.111.35"]
// 1938718066 -> ["193.87.180.66"]
/**
 * 
 * @param {String} data_in 
 * @returns {[String]} Array of Strings containing IP addresses
 */
export default function generate_ip_addresses(data_in) {
    var input = String(data_in)
    var output = []
    for (let st_len = 1; st_len <= 3; st_len++) { // For all possible lengths of the 1st octet
        for (let nd_len = 1; nd_len <= 3; nd_len++) { // For all possible lengths of the 2nd octet
            for (let rd_len = 1; rd_len <= 3; rd_len++) { // For all possible lengths of the 3rd octet
                for (let th_len = 1; th_len <= 3; th_len++) { // For all possible lengths of the 4th octet
                    if (st_len + nd_len + rd_len + th_len === input.length) { // If length of IP matches possible lengths, cut string accordingly
                        let st_num = parseInt(input.substring(0, st_len), 10)
                        let nd_num = parseInt(input.substring(st_len, st_len + nd_len), 10)
                        let rd_num = parseInt(input.substring(st_len + nd_len, st_len + nd_len + rd_len), 10)
                        let th_num = parseInt(input.substring(st_len + nd_len + rd_len, st_len + nd_len + rd_len + th_len), 10)
                        if (st_num <= 255 && nd_num <= 255 && rd_num <= 255 && th_num <= 255) { // If all parts are valid octets (<=255)
                            let ip = `${st_num}.${nd_num}.${rd_num}.${th_num}`
                            if (ip.length == input.length + 3) { output.push(ip) } // push to the output
                        }
                    }
                }
            }
        }
    }
    return output
}
