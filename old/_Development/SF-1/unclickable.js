/** @param {NS} ns **/
export async function main(ns) {
    // Change style of unclickable
    document.getElementById('unclickable').style = "display: block;position: absolute;top: 50%;left: 50%;width: 100px;height: 100px;z-index: 10000;background: red;";
    // Add event listener to enable click functionality
    document.getElementById('unclickable').parentNode.addEventListener('click', () => {
        // If clicked, hide it again
        document.getElementById('unclickable').style = "display: none; visibility: hidden;";
    }, true);
}