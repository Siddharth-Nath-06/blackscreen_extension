var fullscreenOn = false;

chrome.action.setBadgeText(
    {
        text: "OFF"
    },
    () => { }
);

chrome.action.onClicked.addListener((tab) => {
    let tabId = tab.id;

    execscript(tabId);
});

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === "fullscreen")
        fullscreenOn = info.checked;
});

function execscript(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "test", context: "test" })
        .then(() => { toggleScreen(tabId) })
        .catch((error) => {
            if (error.message.includes("Could not establish connection.")) {
                chrome.scripting.executeScript(
                    {
                        target: { tabId: tabId },
                        files: ['blackscreen.js']
                    },
                    () => { toggleScreen(tabId) }
                );
            }
        });
}

function toggleScreen(tabId) {
    chrome.action.getBadgeText(
        {
            tabId: tabId,
        },
        (badgeText) => {
            if (badgeText === "ON") {
                chrome.tabs.sendMessage(tabId, { action: "OFF", context: "toggle" })
                chrome.action.setBadgeText(
                    {
                        tabId: tabId,
                        text: "OFF"
                    },
                    () => { }
                );
            }
            else {
                chrome.tabs.sendMessage(tabId, { action: "ON", context: "toggle" })
                chrome.action.setBadgeText(
                    {
                        tabId: tabId,
                        text: "ON"
                    },
                    () => { }
                );
            }
        }
    );
}

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.removeAll();
    chrome.contextMenus.create({
        id: "fullscreen",
        title: "Turns on fullscreen on blackscreen toggle",
        contexts: ["action"],
        checked: false,
        type: "checkbox"
    });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'checkfullscreen') {
        sendResponse(fullscreenOn);
        return true;
    }
    else return false;
})