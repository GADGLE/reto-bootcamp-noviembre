const btnScraper = document.getElementById("btn-scraper")
const btnShow = document.getElementById("btn-showProducts")
const resultText = document.getElementById("result")

const portBackground = chrome.runtime.connect({name: "service-worker"})

btnScraper.addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const response = await chrome.tabs.sendMessage(tab.id, { action: "scrap" });
    // do something with response here, not outside the function
    console.log("allisdone");
})

btnShow.addEventListener('click', async () => {
    portBackground.postMessage({cmd: "get-products"})
})

portBackground.onMessage.addListener(function (msg) {
    if(msg.cmd === "products") {
        const {result} = msg
        console.log(result)
        console.log(JSON.stringify(result.products))
        resultText.innerText = JSON.stringify(result.products)
    }
})