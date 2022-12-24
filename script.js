const generate = document.getElementById("generate-new-array")
const sort = document.getElementById("sort")
const barsContainer = document.getElementById("top")
let audioContext = null;
const minimum = 100
const maximum = 150
let numberList = []

function renderBars(size) {

    numberList = Array.from({ length: size }, (value, index) => {
        return index += 100;
    });

    numberList.forEach(number => {
        randomizeSortedArray()
        const bar = document.createElement("div")
        bar.className = "bar"
        bar.style.height = `${number / 2}%`
        bar.dataset.height = number
        barsContainer.appendChild(bar)
    })
}

document.addEventListener("DOMContentLoaded", () => {
    renderBars(maximum)
})

function randomizeSortedArray() {
    numberList.sort(function() {
        return .7 - Math.random()
    })
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function hideButtons() {
    generate.style.display = "none"
    sort.style.display = "none"
}

function showButtons() {
    generate.style.display = "block"
    sort.style.display = "block";
}

function playNote(frequency) {

    if (audioContext == null) {
        audioContext = new(AudioContext || webkitAudioContext || window.webkitAudioContext)()
    }

    const duration = 0.1;
    const oscillator = audioContext.createOscillator()
    const node = audioContext.createGain()
    oscillator.frequency.value = frequency
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration)
    node.gain.value = 0.1
    oscillator.connect(node)
    node.connect(audioContext.destination)

}
generate.addEventListener("click", () => {
    Array.from(barsContainer.children).map((bar) => bar.remove())
    renderBars(maximum)
})

sort.addEventListener("click", async() => {

    hideButtons()

    const maxNumber = Math.max(...numberList) * 10;

    let base = 10;

    iteration = 0;

    while (base < maxNumber) {

        iteration++;

        let occurenceCounter = Array.from({ length: 10 }, () => []);

        for (let significantDigit of numberList) {
            occurenceCounter[Math.floor((significantDigit % base) / (base / 10))].push(significantDigit);
        }

        numberList = occurenceCounter.flat()

        for (let index = 0; index < barsContainer.children.length; index++) {

            currentBar = barsContainer.children[index]
            currentBar.setAttribute("barValue", numberList[index])
            currentBar.style.height = `${numberList[index] / 2}%`
            currentBar.style.backgroundColor = "black"

            switch (iteration) {
                case 1:
                    barsContainer.children[index].style.backgroundColor = "red"
                    break;
                case 2:
                    barsContainer.children[index].style.backgroundColor = "orange"
                    break;
                case 3:
                    barsContainer.children[index].style.backgroundColor = "green"
                    break;
            }
            playNote(50 + numberList[index] * 10);
            await sleep(0.1)
            setTimeout(() => {
                if (iteration < 3) {
                    barsContainer.children[index].style.backgroundColor = "white"
                }
            }, 0.1)
        }

        base *= 10;
    }

    // await sleep(10)

    Array.from(barsContainer.children).map(bar => bar.style.backgroundColor = "white")

    showButtons()

})

if (window.screen.availHeight > window.screen.availWidth) {
    document.getElementById("bottom").style.flexDirection = "column";
    sort.style.marginBottom = "5px";
    generate.style.marginBottom = "10px";
}