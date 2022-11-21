const throttle = document.getElementById("throttle")
const generate = document.getElementById("generate-new-array")
const sort = document.getElementById("sort")
const barsContainer = document.getElementById("top")
const minimum = 200
const maximum = 500
let numberList = []

function renderBars(size) {

    numberList = Array.from({ length: size }, function random() {
        return Math.floor(Math.random() * (maximum - minimum) + minimum)
    });

    numberList.forEach(number => {
        randomizeSortedArray()
        const bar = document.createElement("div")
        bar.className = "bar"
        bar.id = number
        bar.style.height = `${number* 1.5}px`

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

generate.addEventListener("click", () => {
    Array.from(barsContainer.children).map((bar) => bar.remove())
    renderBars(maximum)
})

throttle.addEventListener("change", (event) => {
    Array.from(barsContainer.children).map((bar) => bar.remove())
    renderBars(parseInt(event.target.value))
});

sort.addEventListener("click", async() => {

    let speed = 10;

    hideButtons()

    const maxNumber = Math.max(...numberList) * 10;

    let base = 10;

    while (base < maxNumber) {

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

            if (document.getElementById(significantDigit) != null) {
                switch (base) {
                    case 10:
                        document.getElementById(significantDigit).style.backgroundColor = "green"
                        break;
                    case 100:
                        document.getElementById(significantDigit).style.backgroundColor = "orange"
                        break;
                    case 1000:
                        document.getElementById(significantDigit).style.backgroundColor = "red"
                        break;
                }
            }

            await sleep(speed)

        }

        numberList = occurenceCounter.flat();

        for (let index = 0; index < barsContainer.children.length; index++) {
            barsContainer.children[index].style.height = `${numberList[index]* 1.5}px`
            barsContainer.children[index].style.backgroundColor = "black"
            await sleep(20)
            setTimeout(() => {
                barsContainer.children[index].style.backgroundColor = "white"
            }, 20);
        }

        //remove text inside bars
        if (numberList.length <= 40) {
            Array.from(barsContainer.children).map((bar) => bar.children[0].remove())
        }

        await sleep(speed)

        base *= 10;
    }

    for (let bar of barsContainer.children) {
        bar.style.backgroundColor = "green";
        await sleep(10)
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
