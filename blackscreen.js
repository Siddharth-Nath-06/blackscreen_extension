try {
    chrome.runtime.onMessage.addListener((request) => {
        var action = request.action === "ON" ? ON : OFF;
        action();
    });
} catch (error) {
    console.error("Error in message listener:", error);
}

// #region variable declarations and element settings
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
var titleContent = document.title;
var linkpic;
var linkparent = document.createElement("div");
var linkhref = chrome.runtime.getURL('icons/square-16.ico');
linkparent.innerHTML = `<link rel="shortcut icon" href="` + linkhref + `" type="image/x-icon">`
var link = linkparent.firstChild;
// #endregion

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

window.onload = () => {
    const observer = new MutationObserver(() => {
        if (document.title !== 'Blank Page') {
            titleContent = document.title;
        }
    });
    const titleEl = document.querySelector('title');
    if (titleEl) {
        observer.observe(titleEl, { childList: true });
    }
}

function ON() {
    blackScreen.style.zIndex = getMaxZIndex() + 1;
    blackScreen.style.display = "block";

    document.title = 'Blank Page';

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
    let title = document.getElementsByTagName('title')[0];
    title.textContent = titleContent;
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