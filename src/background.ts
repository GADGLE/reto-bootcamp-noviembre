let state = 0

const delayBackground = (time: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, time)
    })
}

chrome.runtime.onConnect.addListener(function (port) {
    console.log(port.name)
    port.onMessage.addListener(async function (msg) {

        if (msg.cmd === "state") {
            port.postMessage({cmd: state})
        }

        else if (msg.cmd === "set-state") {
            state = 1
        }

        let { products } = msg
        if (msg.cmd === "starting") {
            port.postMessage({ cmd: "start-scraping" })
        }
        if (msg.cmd === "scraped") {
            chrome.storage.local.set({ products })
                .then(() => {
                    port.postMessage({ cmd: "scrap-next-page" })
                })
        }
        else if (msg.cmd === "next-page") {
            console.log("next-page")
            chrome.storage.local.get(["products"]).then((result) => {
                console.log(result.products)
                products = [...result.products, ...products]
                chrome.storage.local.set({ products })
                    .then(() => {
                        port.postMessage({ cmd: "scrap-next-page" })
                    })
            });
        }
        else if (msg.cmd === "next-step") {
            await delayBackground(5000)
            port.postMessage({ cmd: "scrap-next-page" })
        }
        if (msg.cmd === "get-products")
            chrome.storage.local.get(["products"]).then((result) => {
                port.postMessage({ cmd: "products", result })
            });
    });
});