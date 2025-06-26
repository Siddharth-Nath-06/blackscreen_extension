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
var title = document.getElementsByTagName("title")[0];
var titleContent = '';

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
    blackScreen.style.display = "block";
    title = document.getElementsByTagName("title")[0];
    titleContent = title.innerText;
    title.innerText = "Blank Page";
}

function OFF() {
    blackScreen.style.display = "none";
    title.innerText = titleContent;
}
