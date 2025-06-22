const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const userData = ipcRenderer.sendSync('get-user-data-path');
const CONFIG_PATH = path.join(userData, 'config.json');

function load() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
  } catch {
    return { palabraKey: '', livekitUrl: '' };
  }
}

function save(cfg) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

module.exports = { load, save, CONFIG_PATH };
