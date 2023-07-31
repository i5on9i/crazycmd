const commandName = 'detach-to-window';
const commandName2 = 'merge-to-window';

/**
 * Update the UI: set the value of the shortcut textbox.
 */
async function updateUI() {
  // commands defined in `manifest.json`
  let commands = await browser.commands.getAll();
  for (let command of commands) {
    if (command.name === commandName) {
      document.querySelector(`.cmdline[data-cmdid=${commandName}] input`).value = command.shortcut
    }
  }
}

/**
 * Update the shortcut based on the value in the textbox.
 */
async function updateShortcut(evt) {
  await browser.commands.update({
    name: evt.target.dataset.cmdid,
    shortcut: evt.target.querySelector('input').value
  });
}

/**
 * Reset the shortcut and update the textbox.
 */
async function resetShortcut() {
  await browser.commands.reset(commandName);
  updateUI();
}

/**
 * Update the UI when the page loads.
 */
document.addEventListener('DOMContentLoaded', updateUI);

/**
 * Handle update and reset button clicks
 */
document.querySelector('div.cmdline .update').addEventListener('click', updateShortcut)
document.querySelector('div.cmdline .reset').addEventListener('click', resetShortcut)