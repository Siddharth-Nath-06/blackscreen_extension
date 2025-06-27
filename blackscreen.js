try {
    chrome.runtime.onMessage.addListener((request) => {
        var action = request.action === "ON" ? ON : OFF;
        action();
    });
} catch (error) {
    console.error("Error in message listener:", error);
}

var root = document.getElementsByTagName("html")[0];
var blackScreen = document.createElement("div");
blackScreen.style.height = "100vh";
blackScreen.style.width = "100vw";
blackScreen.style.backgroundColor = "black";
blackScreen.style.position = "fixed";
blackScreen.style.display = "none";
blackScreen.style.top = "0px";
blackScreen.style.left = "0px";
blackScreen.style.zIndex = getMaxZIndex() + 1;
root.appendChild(blackScreen);
var title = document.querySelector('title');
var titleContent = document.title;
var linkpic;
var linkparent = document.createElement("div");
linkparent.innerHTML = `<link rel="shortcut icon" href="icons/square-128.png" type="image/x-icon">`
var link = linkparent.firstChild;

function getMaxZIndex() {
    let maxZ = 0;
    const elements = document.querySelectorAll('*');
    elements.forEach(element => {
        const zIndex = window.getComputedStyle(element).getPropertyValue('z-index');
        if (zIndex !== 'auto' && !isNaN(parseInt(zIndex))) {
            maxZ = Math.max(maxZ, parseInt(zIndex));
        }
    });
    return maxZ;
}

function ON() {
    blackScreen.style.zIndex = getMaxZIndex() + 1;
    blackScreen.style.display = "block";
    titleContent = (titleContent!==title.textContent && title.textContent!=='')?title.textContent:((titleContent!==document.title && document.title!=='')?document.title:titleContent);
    document.title = "Blank Page";

    linkpic = [...document.querySelectorAll('link[rel~="icon"]')];
    linkpic.forEach((e) => {
        document.head.removeChild(e);
    });
    document.head.appendChild(link);
    checkfullscreentoggle().then((e) => {
        if (e) {
            blackScreen.requestFullscreen();
        }
    })
}

function OFF() {
    blackScreen.style.display = "none";
    document.title = titleContent;
    document.head.removeChild(link);
    linkpic.forEach((e) => {
        document.head.appendChild(e);
    });
}


async function checkfullscreentoggle() {
    return new Promise((resolve, reject) => {
        chrome.runtime.sendMessage({ action: "checkfullscreen" }, (response) => {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(response);
            }
        });
    });
}