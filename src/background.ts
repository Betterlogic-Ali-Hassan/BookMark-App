/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
chrome.runtime.onInstalled.addListener(() => {
  chrome.tabs.create({ url: "https://example.com/" });
  console.log("Extension installed and opened example.com");
});

// Check if all windows are closed and open a new tab if necessary
chrome.windows.onRemoved.addListener(() => {
  chrome.windows.getAll({}, (windows: chrome.windows.Window[]) => {
    if (windows.length === 0) {
      chrome.tabs.create({ url: "https://example.com/" });
      console.log("All windows closed, reopening example.com");
    }
  });
});

// Handle messages from popup
chrome.runtime.onMessage.addListener(
  (
    request: { action: string; folderId?: string },
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void
  ) => {
    if (request.action === "getBookmarks") {
      chrome.bookmarks.getTree((bookmarkTreeNodes: chrome.bookmarks.BookmarkTreeNode[]) => {
        sendResponse(bookmarkTreeNodes);
      });
      return true; // Indicate async response expected
    }

    if (request.action === "addBookmark") {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
        if (tabs.length > 0) {
          chrome.bookmarks.create(
            {
              parentId: request.folderId,
              title: tabs[0].title || "Untitled",
              url: tabs[0].url || "",
            },
            () => {
              if (chrome.runtime.lastError) {
                sendResponse({ status: "error", message: chrome.runtime.lastError.message });
              } else {
                sendResponse({ status: "success", message: "Bookmark added successfully!" });
              }
            }
          );
        } else {
          sendResponse({ status: "error", message: "No active tab found." });
        }
      });
      return true; // Indicate async response expected
    }
  }
);
