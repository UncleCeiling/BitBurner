/** @param {NS} ns */
export async function main(ns) {
    function play() {
        var audio = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3');
        audio.play();
    }

    play()
}