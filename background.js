const COMMAND_DETACH_TO_WINDOW = "detach-to-window"
const COMMAND_MERGE_INTO_WINDOW = "merge-into-window"
const COMMAND_RESIZE_WINDOW = "resize-window"
const COMMAND_DETACH_AND_RESIZE_WINDOW = "detach-and-resize-window"
let lastFocusedWindowId = browser.windows.WINDOW_ID_NONE
let curWindowId = browser.windows.WINDOW_ID_NONE


function runDetachResizeWindow() {
  // ref: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Tabs/query
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      browser.windows.create({ tabId: activeTab.id }).then((window) => {
        let updateInfo = {
          width: Math.floor(window.width / 2),
          // height: currentWindow.height
        };

        browser.windows.update(window.id, updateInfo);
      });
    }
  })
}


function runDetachWindow() {
  // ref: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Tabs/query
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    if (activeTab) {
      browser.windows.create({ tabId: activeTab.id })
    }
  })
}

function runMergeIntoWindow() {
  browser.tabs.query({ currentWindow: true }, (curTabs) => {
    const tabIds = curTabs.map((curTab) => curTab.id)

    // to get the tabs count
    browser.tabs.query({ windowId: lastFocusedWindowId }, (tabs) => {
      // to merge
      browser.tabs.move(tabIds, { windowId: lastFocusedWindowId, index: tabs.length })
    });

  })
}

function runResizeWindow() {
  browser.windows.getCurrent().then((currentWindow) => {
    let updateInfo = {
      width: Math.floor(currentWindow.width / 2),
      // height: currentWindow.height
    };

    browser.windows.update(currentWindow.id, updateInfo);
  });
}
/**
 * Returns all of the registered extension commands for this extension
 * and their shortcut (if active).
 *
 * Since there is only one registered command in this sample extension,
 * the returned `commandsArray` will look like the following:
 *    [{
 *       name: "toggle-feature",
 *       description: "Send a 'toggle-feature' event to the extension"
 *       shortcut: "Ctrl+Shift+U"
 *    }]
 */
let gettingAllCommands = browser.commands.getAll();
gettingAllCommands.then((commands) => {
  for (let command of commands) {
    // Note that this logs to the Add-on Debugger's console: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Debugging
    // not the regular Web console.
    console.log(command);
  }
});

/**
 * Fired when a registered command is activated using a keyboard shortcut.
 *
 * In this sample extension, there is only one registered command: "Ctrl+Shift+U".
 * On Mac, this command will automatically be converted to "Command+Shift+U".
 */
browser.commands.onCommand.addListener((command) => {
  const cmdFunc = getCommandFunc(command)
  cmdFunc()
})

function getCommandFunc(command) {
  switch (command) {
    case COMMAND_DETACH_TO_WINDOW:
      return runDetachWindow
    case COMMAND_MERGE_INTO_WINDOW:
      return runMergeIntoWindow
    case COMMAND_RESIZE_WINDOW:
      return runResizeWindow
    case COMMAND_DETACH_AND_RESIZE_WINDOW:
      return runDetachResizeWindow
  }
}

browser.tabs.onDetached.addListener((tabId, detachInfo) => {
  // console.log(detachInfo.oldWindowId)
});


browser.windows.onFocusChanged.addListener((newWindowId) => {
  if(newWindowId === browser.windows.WINDOW_ID_NONE ){
    return
  }
  lastFocusedWindowId = curWindowId
  curWindowId = newWindowId
})