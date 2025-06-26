chrome.action.setBadgeText(
    {
        text: "OFF"
    },
    () => { }
);

chrome.action.onClicked.addListener((tab) => {
    let tabId = tab.id;

    execscript(tabId);

    chrome.action.getBadgeText(
        {
            tabId: tabId,
        },
        (badgeText) => {
            if (badgeText === "ON") {
                chrome.tabs.sendMessage(tabId, { action: "OFF" })
                chrome.action.setBadgeText(
                    {
                        tabId: tabId,
                        text: "OFF"
                    },
                    () => { }
                );
            }
            else {
                chrome.tabs.sendMessage(tabId, { action: "ON" })
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
});

function execscript(tabId) {
    chrome.tabs.sendMessage(tabId, { action: "test" }).catch((error) => {
        if (error.message.includes("Could not establish connection.")) {
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ['blackscreen.js']
            },
                () => {
                    if (chrome.runtime.lastError) {
                        console.error(chrome.runtime.lastError.message);
                    }
                });
        }
    });
}