const throttle = document.getElementById("throttle")
const generate = document.getElementById("generate-new-array")
const sort = document.getElementById("sort")
const sortContainer = document.getElementById("top")
const minimum = 200
const maximum = 500
let sortedListOfIntegers = []

function renderBars(size) {

    sortedListOfIntegers = Array(size).fill().map(function random() {
        return Math.floor(Math.random() * (maximum - minimum) + minimum)
    })

    sortedListOfIntegers.forEach(number => {
        randomizeSortedArray()
        const bar = document.createElement("div")
        bar.className = "bar"
        bar.id = number
        bar.style.height = `${number* 1.5}px`

        sortContainer.appendChild(bar)
    })
}

document.addEventListener("DOMContentLoaded", () => {
    renderBars(maximum)
})

function randomizeSortedArray() {
    sortedListOfIntegers.sort(function() {
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

generate.addEventListener("click", () => {
    Array.from(sortContainer.children).map((bar) => bar.remove())
    renderBars(maximum)
})

throttle.addEventListener("change", (event) => {
    Array.from(sortContainer.children).map((bar) => bar.remove())
    renderBars(parseInt(event.target.value))
});

sort.addEventListener("click", async() => {

    let speed = 10;

    hideButtons()

    const maxNumber = Math.max(...sortedListOfIntegers) * 10;

    let divisor = 10;

    while (divisor < maxNumber) {

        for (let index = 0; index < sortedListOfIntegers.length; index++) {
            if (sortedListOfIntegers.length <= 40) {
                const value = document.createElement("div")
                value.className = "value"
                value.textContent = sortedListOfIntegers[index]
                sortContainer.children[index].appendChild(value)
            }
        }

        Array.from(sortContainer.children).map((bar) => bar.style.backgroundColor = "white");

        let buckets = Array(10).fill().map(() => []);

        for (let significantDigit of sortedListOfIntegers) {

            buckets[Math.floor((significantDigit % divisor) / (divisor / 10))].push(significantDigit);

            if (divisor == 10 && document.getElementById(significantDigit) != null) {
                document.getElementById(significantDigit).style.backgroundColor = "green"
            }

            if (divisor == 100 && document.getElementById(significantDigit) != null) {
                document.getElementById(significantDigit).style.backgroundColor = "orange"
            }

            if (divisor == 1000 && document.getElementById(significantDigit) != null) {
                document.getElementById(significantDigit).style.backgroundColor = "red"
            }

            await sleep(speed)
            Array.from(sortContainer.children).map((bar, index) => bar.style.height = `${sortedListOfIntegers[index++]* 1.5}px`)
        }

        sortedListOfIntegers = [].concat.apply([], buckets);

        console.table(buckets);

        if (sortedListOfIntegers.length <= 40) {
            Array.from(sortContainer.children).map((bar) => bar.children[0].remove())
        }

        await sleep(speed)

        divisor *= 10;
    }

    Array.from(sortContainer.children).map((bar, index) => bar.style.height = `${sortedListOfIntegers[index++]* 1.5}px`)

    for (let bar of sortContainer.children) {
        bar.style.backgroundColor = "green";
        await sleep(speed)
    }

    Array.from(sortContainer.children).map((bar) => bar.style.backgroundColor = "white");

    for (let index = 0; index < sortedListOfIntegers.length; index++) {
        if (sortedListOfIntegers.length <= 40) {
            const value = document.createElement("div")
            value.className = "value"
            value.textContent = sortedListOfIntegers[index]
            sortContainer.children[index].appendChild(value)
        }
    }
    showButtons()

})