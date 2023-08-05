const commandName = 'detach-to-window';
const commandName2 = 'merge-to-window';

/**
 * Update the UI: set the value of the shortcut textbox.
 */
async function updateUI() {
  // commands defined in `manifest.json`
  let commands = await browser.commands.getAll();
  for (let command of commands) {
    document.querySelector(`.cmdline[data-cmdid=${command.name}] input`).value = command.shortcut
  }
}

/**
 * Update the shortcut based on the value in the textbox.
 */
async function updateShortcut(evt) {
  const pel = evt.target.parentElement
  await browser.commands.update({
    name: pel.dataset.cmdid,
    shortcut: pel.querySelector('input').value
  });
}

/**
 * Reset the shortcut and update the textbox.
 */
async function resetShortcut() {
  await browser.commands.reset(commandName);
  // updateUI();
}

/**
 * Update the UI when the page loads.
 */
document.addEventListener('DOMContentLoaded', updateUI);

/**
 * Handle update and reset button clicks
 */
const nodelist = document.querySelectorAll('div.cmdline')
for (let i = 0; i < nodelist.length; i++) {
  nodelist[i].querySelector('.update').addEventListener('click', updateShortcut)
  nodelist[i].querySelector('.reset').addEventListener('click', resetShortcut)
}
