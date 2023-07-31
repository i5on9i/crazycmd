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
  if (command === 'detach-to-window') {
    // ref: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Tabs/query
    browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];
      if (activeTab) {
        browser.windows.create({ tabId: activeTab.id });
      }
    })
  }
  if (command === 'merge-to-window') {
    // ref: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/Tabs/query
    browser.tabs.query({ currentWindow: true }, (curTabs) => {
      const tabIds = curTabs.map((curTab) => curTab.id)

      browser.tabs.query({ windowId: 1 }, (tabs) => {
        browser.tabs.move(tabIds, {windowId: 1, index: tabs.length})  
      });
    })
  }
})


browser.tabs.onDetached.addListener((tabId, detachInfo) => {
  // console.log(detachInfo.oldWindowId)
});