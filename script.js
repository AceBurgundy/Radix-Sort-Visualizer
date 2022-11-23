const throttle = document.getElementById("throttle")
const generate = document.getElementById("generate-new-array")
const sort = document.getElementById("sort")
const barsContainer = document.getElementById("top")
let audioContext = null;
const minimum = 100
const maximum = 200
let numberList = []

function renderBars(size) {

    numberList = Array.from({ length: size }, (value, index) => {
        return index += 100;
    });

    numberList.forEach(number => {
        randomizeSortedArray()
        const bar = document.createElement("div")
        bar.className = "bar"
        bar.style.height = `${number* 2.5}px`
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
    throttle.style.display = "none"
}

function showButtons() {
    generate.style.display = "block"
    sort.style.display = "block";
    throttle.style.display = "block"
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

throttle.addEventListener("change", (event) => {
    Array.from(barsContainer.children).map((bar) => bar.remove())
    renderBars(parseInt(event.target.value))
});

sort.addEventListener("click", async() => {

    hideButtons()

    const maxNumber = Math.max(...numberList) * 10;

    let base = 10;

    iteration = 0;

    while (base < maxNumber) {

        iteration++;

        for (let index = 0; index < numberList.length; index++) {
            if (numberList.length <= 40) {
                const value = document.createElement("div")
                value.className = "value"
                value.textContent = numberList[index]
                barsContainer.children[index].appendChild(value)
            }
        }

        let occurenceCounter = Array.from({ length: 10 }, () => []);

        for (let significantDigit of numberList) {

            occurenceCounter[Math.floor((significantDigit % base) / (base / 10))].push(significantDigit);

            if (document.querySelector(`[data-height="${significantDigit}"]`) != null) {
                switch (base) {
                    case 10:
                        document.querySelector(`[data-height="${significantDigit}"]`).style.backgroundColor = "green"
                        playNote(50 + significantDigit * 10);
                        setTimeout(() => {
                            document.querySelector(`[data-height="${significantDigit}"]`).style.backgroundColor = "white"
                        }, 80)
                        break;
                    case 100:
                        document.querySelector(`[data-height="${significantDigit}"]`).style.backgroundColor = "orange"
                        playNote(50 + significantDigit * 10);
                        setTimeout(() => {
                            document.querySelector(`[data-height="${significantDigit}"]`).style.backgroundColor = "white"
                        }, 80)
                        break;
                    case 1000:
                        document.querySelector(`[data-height="${significantDigit}"]`).style.backgroundColor = "red"
                        playNote(50 + significantDigit * 10);
                        setTimeout(() => {
                            document.querySelector(`[data-height="${significantDigit}"]`).style.backgroundColor = "white"
                        }, 80)
                        break;
                }
            }

            await sleep(0.1)

        }

        numberList = occurenceCounter.flat()

        for (let index = 0; index < barsContainer.children.length; index++) {

            barsContainer.children[index].setAttribute("barValue", numberList[index])

            barsContainer.children[index].style.height = `${numberList[index] * 2.5}px`
            barsContainer.children[index].style.backgroundColor = "black"
            if (iteration == 3) {
                playNote(50 + numberList[index] * 10);
                await sleep(0.1)
                setTimeout(() => {
                    barsContainer.children[index].style.backgroundColor = "green"
                }, 01)
            } else {
                playNote(50 + numberList[index] * 10);
                await sleep(01)
                setTimeout(() => {
                    barsContainer.children[index].style.backgroundColor = "white"
                }, 01)
            }
        }

        // remove text inside bars
        if (numberList.length <= 40) {
            barsContainer.innerHTML = ""
        }

        base *= 10;

        if (numberList.length < 100 && iteration == 2) {
            break;
        }
    }

    await sleep(400)

    Array.from(barsContainer.children).map(bar => bar.style.backgroundColor = "white")

    //show all numbers after everything is completed only when length is 40
    if (numberList.length <= 40) {
        numberList.forEach((number, index) => {
            const value = document.createElement("div")
            value.className = "value"
            value.textContent = numberList[index]
            barsContainer.children[index].appendChild(value)
        })
    }

    showButtons()

})
