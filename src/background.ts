/* eslint-disable @typescript-eslint/no-explicit-any */

const storedBookmarks: { [url: string]: string } = {}; // Store bookmarks by URL

// Paths to your icons
const BOOKMARKED_ICON_PATH = "icons/yes.png"; // Path to the "yes" icon
const NOT_BOOKMARKED_ICON_PATH = "icons/no.png"; // Path to the "no" icon

// Function to update the extension icon based on bookmark status
const updateIcon = (isBookmarked: boolean) => {
  const iconPath = isBookmarked ? BOOKMARKED_ICON_PATH : NOT_BOOKMARKED_ICON_PATH;
  chrome.action.setIcon({ path: iconPath });
};

// Function to check if the current tab is bookmarked
const checkIfBookmarked = (url: string, callback: (isBookmarked: boolean) => void) => {
  chrome.bookmarks.search({ url }, (results) => {
    callback(results.length > 0);
  });
};

// Listen for tab updates to check bookmark status
chrome.tabs.onUpdated.addListener((_tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && tab.url) {
    checkIfBookmarked(tab.url, (isBookmarked) => {
      updateIcon(isBookmarked);
    });
  }
});

// Listen for tab switches to check bookmark status
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      checkIfBookmarked(tab.url, (isBookmarked) => {
        updateIcon(isBookmarked);
      });
    }
  });
});

// Initial setup when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: "https://example.com/" });
  // chrome.action.setBadgeText({ text: "OFF" });
  console.log("Extension installed and opened example.com");
});

// Handle window close events
chrome.windows.onRemoved.addListener(() => {
  chrome.windows.getAll({}, (windows: chrome.windows.Window[]) => {
    if (windows.length === 0) {
      chrome.tabs.create({ url: "https://example.com/" });
      console.log("All windows closed, reopening example.com");
    }
  });
});

// Detect when popup is opened
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    console.log("Popup opened - Badge set to ON");
    // chrome.action.setBadgeText({ text: "ON" });

    // Get the active tab
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0 && tabs[0].url) {
        const currentUrl = tabs[0].url;

        // Check if the URL is already bookmarked in Chrome
        chrome.bookmarks.search({ url: currentUrl }, (results) => {
          if (results.length > 0) {
            console.log("Bookmark already exists for this tab, skipping addition.");
            storedBookmarks[currentUrl] = results[0].id; // Store existing bookmark ID
            updateIcon(true); // Update icon to "yes.png"
          } else {
            // If not found, create a new bookmark
            chrome.bookmarks.create(
              {
                parentId: "1", // Default to "Bookmarks Bar"
                title: tabs[0].title || "Untitled",
                url: currentUrl,
              },
              (newBookmark) => {
                if (chrome.runtime.lastError) {
                  console.error("Error adding bookmark:", chrome.runtime.lastError.message);
                  return;
                }
                storedBookmarks[currentUrl] = newBookmark.id; // Store new bookmark ID
                console.log("Bookmark added:", newBookmark);
                updateIcon(true); // Update icon to "yes.png"
              }
            );
          }
        });
      }
    });

    // Detect when popup is closed
    port.onDisconnect.addListener(() => {
      console.log("Popup closed - Badge set to OFF");
      // chrome.action.setBadgeText({ text: "OFF" });
    });
  }
});

// Handle "Remove Bookmark" from UI
chrome.runtime.onMessage.addListener(
  (
    request: { action: string; parentId?: string; title?: string; url?: string },
    _sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (request.action === "addBookmark" && request.title && request.url) {
      console.log("Adding bookmark...");

      chrome.bookmarks.create(
        {
          parentId: request.parentId || "1", // Use selected folder or default to "Bookmarks Bar"
          title: request.title,
          url: request.url,
        },
        (newBookmark) => {
          if (chrome.runtime.lastError) {
            console.error("Error adding bookmark:", chrome.runtime.lastError.message);
            sendResponse({ status: "error", message: chrome.runtime.lastError.message });
            return;
          }

          console.log("Bookmark added:", newBookmark);
          sendResponse({ status: "success", message: "Bookmark added successfully!" });
          updateIcon(true); // Update icon to "yes.png"
        }
      );
      return true; // Async response
    }
  }
);