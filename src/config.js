const fs = require('fs');
const path = require('path');
const { ipcRenderer } = require('electron');

const userData = ipcRenderer.sendSync('get-user-data-path');
const CONFIG_PATH = path.join(userData, 'config.json');

function load() {
  const defaults = {
    palabraKey: '',
    livekitUrl: '',
    livekitApiKey: '',
    livekitApiSecret: '',
  };

  try {
    const data = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8'));
    return { ...defaults, ...data };
  } catch {
    return defaults;
  }
}

function save(cfg) {
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(cfg, null, 2));
}

module.exports = { load, save, CONFIG_PATH };
