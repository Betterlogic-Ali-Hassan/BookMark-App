/* eslint-disable @typescript-eslint/no-explicit-any */

const storedBookmarks: { [url: string]: string } = {}; // ✅ Store bookmarks by URL

chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: "https://example.com/" });
  chrome.action.setBadgeText({ text: "OFF" });
  console.log("Extension installed and opened example.com");
});

chrome.windows.onRemoved.addListener(() => {
  chrome.windows.getAll({}, (windows: chrome.windows.Window[]) => {
    if (windows.length === 0) {
      chrome.tabs.create({ url: "https://example.com/" });
      console.log("All windows closed, reopening example.com");
    }
  });
});

// ✅ Detect when popup is opened
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    console.log("Popup opened - Badge set to ON");
    chrome.action.setBadgeText({ text: "ON" });

    // ✅ Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        const currentUrl = tabs[0].url;

        // ✅ Check if the URL is already bookmarked in Chrome
        chrome.bookmarks.search({ url: currentUrl }, (results) => {
          if (results.length > 0) {
            console.log("Bookmark already exists for this tab, skipping addition.");
            storedBookmarks[currentUrl] = results[0].id; // ✅ Store existing bookmark ID
          } else {
            // ✅ If not found, create a new bookmark
            chrome.bookmarks.create(
              {
                parentId: "1", // ✅ Default to "Bookmarks Bar"
                title: tabs[0].title || "Untitled",
                url: currentUrl,
              },
              (newBookmark) => {
                if (chrome.runtime.lastError) {
                  console.error("Error adding bookmark:", chrome.runtime.lastError.message);
                  return;
                }
                storedBookmarks[currentUrl] = newBookmark.id; // ✅ Store new bookmark ID
                console.log("Bookmark added:", newBookmark);
              }
            );
          }
        });
      }
    });

    // ✅ Detect when popup is closed
    port.onDisconnect.addListener(() => {
      console.log("Popup closed - Badge set to OFF");
      chrome.action.setBadgeText({ text: "OFF" });
    });
  }
});

// ✅ Handle "Remove Bookmark" from UI
chrome.runtime.onMessage.addListener(
  (
    request: { action: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (request.action === "removeBookmark") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0 && tabs[0].url) {
          const currentUrl = tabs[0].url;

          // ✅ Check if the URL exists in bookmarks
          chrome.bookmarks.search({ url: currentUrl }, (results) => {
            if (results.length > 0) {
              // ✅ Remove the first matching bookmark
              chrome.bookmarks.remove(results[0].id, () => {
                if (chrome.runtime.lastError) {
                  console.error("Error removing bookmark:", chrome.runtime.lastError.message);
                  sendResponse({ status: "error", message: chrome.runtime.lastError.message });
                  return;
                }
                console.log("Bookmark removed:", results[0].id);
                delete storedBookmarks[currentUrl]; // ✅ Remove from local storage
                sendResponse({ status: "success", message: "Bookmark removed successfully!" });
              });
            } else {
              sendResponse({ status: "warn", message: "No bookmark found for this tab." });
            }
          });
        }
      });
      return true; // Async response
    }
  }
);
