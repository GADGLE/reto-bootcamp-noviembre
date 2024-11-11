const port = chrome.runtime.connect({ name: "service-worker" });
const body = document.querySelector('body')

console.log("Init")
port.postMessage({ cmd: "state" })

let currentPage = 0
let categoryItem = 0

const delay = (time: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

chrome.runtime.onMessage.addListener(
    function (message, sender, response) {
        console.log("out")
        if (message.action === "scrap") {
            console.log("in")
            currentPage++
            port.postMessage({ cmd: "starting" });
            response("Scraping initialized")
        }
    }
);


port.onMessage.addListener(

    async function (message) {

        if (message.cmd === 1) {
            console.log(currentPage)
            currentPage++
            const products = await scrapping(currentPage)
            console.log("scrapping")
            if (products === "END-CATEGORY") {
                nextStep()
            }
            else if (message.cmd === "scrap-next-page" || message.cmd === 1) {
                console.log("scrap-next-page")
                port.postMessage({ cmd: "next-page", products })
            }
        }

        if (message.cmd === "scrap-next-page") {
            console.log(currentPage)
            currentPage++
            const products = await scrapping(currentPage)
            console.log("scrapping")

            if (products === "END-CATEGORY") {
                nextStep()
            }
            else if (message.cmd === "scrap-next-page" || message.cmd === 1) {
                console.log("scrap-next-page")
                port.postMessage({ cmd: "next-page", products })
            }
        }
        if (message.cmd === "start-scraping") {
            firstStep()
        }

    }

);


async function scrapping(currentPage: number) {
    await delay(4000)
    console.log(1234)
    /* if (!document.querySelectorAll(".textMenu")[categoryItem]) {
        return "END"
    } */
    if (!document.querySelector('.pagination__nav') || document.querySelector(".pagination__item.page-control.next.disabled")) {
        console.log("END-CATEGORY")
        return "END-CATEGORY"
    }
    console.log(1234)
    const cardsList = Array.from(document.querySelectorAll(".showcase-description"))
    const products = cardsList.map((element) => {
        const productName = element.querySelector(".Showcase__name").innerText
        const brand = element.querySelector(".brand").innerText
        const price = element.querySelector(".price").innerText

        return {
            productName, brand, price
        }
    })

    document.querySelector('.pagination__item.page-control.next').click()
    console.log(products)
    return products
}

async function simulateHover(categoryNumber: number) {
    await delay(3000)
    const hoverCategory = document.querySelectorAll(".textMenu");

    let evt = new MouseEvent("mouseover", {
        bubbles: true,
        cancelable: true,
        view: window,
    });

    hoverCategory[categoryNumber].dispatchEvent(evt);
}

async function simulateNextHover() {
    await delay(3000)
    const hoverCategory = document.querySelector(".MainMenu__wrapper__departments__item.active").nextSibling.childNodes[0].childNodes[0]

    let evt = new MouseEvent("mouseover", {
        bubbles: true,
        cancelable: true,
        view: window,
    });

    hoverCategory.dispatchEvent(evt);
}

function clickBarMenu() {
    document.getElementById('menu-button-desktop').click()
}

async function supermarketItemMenu() {
    await delay(1000)
    // port.postMessage({ cmd: "next-step" });
    document.querySelector(".MainMenu__wrapper__subcategories__departmentItem__link").click()
}
//Add query selector for "Ver Todo"

async function firstStep() {
    clickBarMenu()
    await simulateHover(categoryItem)
    console.log(categoryItem)
    await showSupermarketList()
    port.postMessage({ cmd: "set-state" })
    await supermarketItemMenu()
    /*     const products = await scrapping(currentPage)
        port.postMessage({ cmd: "scraped", products }); */
}

async function nextStep() {
    currentPage = 0
    clickBarMenu()
    console.log(categoryItem + "next-step")
    await simulateNextHover()
    await showAllClick()
    port.postMessage({ cmd: "next-step" })
}

async function showAllClick() {
    await delay(1500)
        .then(() => {
            document.querySelector(".MainMenu__wrapper__departments__item.link-all>a").click()
        })
}

async function showSupermarketList() {
    await delay(2000)
    document.querySelector(".MainMenu__wrapper__categories>ul").childNodes[1].childNodes[0].childNodes[0].click()
    console.log("showSupermarketlist")
}
